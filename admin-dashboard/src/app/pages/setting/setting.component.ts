import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingService } from './setting.service';
import { SystemConfig } from './setting.model';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  settingsForm!: FormGroup;
  loading = false;
  saving = false;
  error: string | null = null;
  successMessage: string | null = null;

  logoPreview: string | null = null;
  selectedLogoFile: File | null = null;

  timeUnits = [
    { value: 'minutes', label: 'Phút' },
    { value: 'hours', label: 'Giờ' },
  ];

  themes = [
    { value: 'light', label: 'Sáng', icon: 'light_mode' },
    { value: 'dark', label: 'Tối', icon: 'dark_mode' },
    { value: 'auto', label: 'Tự động', icon: 'brightness_auto' },
  ];

  constructor(
    private fb: FormBuilder,
    private settingService: SettingService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadSettings();
  }

  initializeForm(): void {
    this.settingsForm = this.fb.group({
      // SLA Configuration
      sla: this.fb.group({
        responseTime: [30, [Validators.required, Validators.min(1), Validators.max(1440)]],
        responseUnit: ['minutes', Validators.required],
        completionTime: [120, [Validators.required, Validators.min(1), Validators.max(10080)]],
        completionUnit: ['minutes', Validators.required],
      }),

      // Notification Configuration
      notifications: this.fb.group({
        enabled: [true],
        email: this.fb.group({
          enabled: [false],
          smtpHost: [''],
          smtpPort: [587],
          smtpUser: [''],
          smtpPassword: [''],
          fromEmail: [''],
        }),
        sms: this.fb.group({
          enabled: [false],
          provider: [''],
          apiKey: [''],
          apiSecret: [''],
        }),
        zalo: this.fb.group({
          enabled: [false],
          oaId: [''],
          appId: [''],
          appSecret: [''],
        }),
      }),

      // System UI Configuration
      ui: this.fb.group({
        systemName: ['Hệ thống báo cáo sự cố', Validators.required],
        theme: ['light', Validators.required],
        logoUrl: [''],
      }),
    });

    // Subscribe to notifications enabled changes
    this.settingsForm.get('notifications.enabled')?.valueChanges.subscribe((enabled) => {
      if (!enabled) {
        this.settingsForm.get('notifications.email.enabled')?.setValue(false);
        this.settingsForm.get('notifications.sms.enabled')?.setValue(false);
        this.settingsForm.get('notifications.zalo.enabled')?.setValue(false);
      }
    });
  }

  loadSettings(): void {
    this.loading = true;
    this.error = null;

    this.settingService.getSystemConfig().subscribe({
      next: (config: SystemConfig) => {
        this.settingsForm.patchValue(config);
        if (config.ui?.logoUrl) {
          this.logoPreview = config.ui.logoUrl;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Không thể tải cấu hình hệ thống. Vui lòng thử lại.';
        this.loading = false;
        console.error('Error loading settings:', err);
      },
    });
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.match(/image\/(png|jpg|jpeg)/)) {
        this.error = 'Chỉ chấp nhận file PNG, JPG hoặc JPEG';
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.error = 'Kích thước file không được vượt quá 2MB';
        return;
      }

      this.selectedLogoFile = file;

      // Preview
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.logoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      this.error = null;
    }
  }

  resetLogo(): void {
    this.selectedLogoFile = null;
    this.logoPreview = null;
    this.settingsForm.get('ui.logoUrl')?.setValue('');
  }

  onSubmit(): void {
    if (this.settingsForm.invalid) {
      this.markFormGroupTouched(this.settingsForm);
      this.error = 'Vui lòng kiểm tra lại các trường thông tin';
      return;
    }

    this.saving = true;
    this.error = null;
    this.successMessage = null;

    const formData = new FormData();

    // Add logo file if selected
    if (this.selectedLogoFile) {
      formData.append('logo', this.selectedLogoFile);
    }

    // Add form data
    formData.append('config', JSON.stringify(this.settingsForm.value));

    this.settingService.updateSystemConfig(formData).subscribe({
      next: (response) => {
        this.saving = false;
        this.successMessage = 'Cập nhật cấu hình thành công!';
        this.settingsForm.markAsPristine();

        // Apply theme immediately
        const theme = this.settingsForm.get('ui.theme')?.value;
        this.applyTheme(theme);

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        this.saving = false;
        this.error = 'Không thể cập nhật cấu hình. Vui lòng thử lại.';
        console.error('Error updating settings:', err);
      },
    });
  }

  applyTheme(theme: string): void {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  onThemeChange(theme: string): void {
    this.settingsForm.get('ui.theme')?.setValue(theme);
    this.applyTheme(theme);
  }

  isNotificationChannelEnabled(channel: 'email' | 'sms' | 'zalo'): boolean {
    const notificationsEnabled = this.settingsForm.get('notifications.enabled')?.value;
    return notificationsEnabled;
  }

  getSLAWarning(field: string): string | null {
    const control = this.settingsForm.get(`sla.${field}`);
    if (!control) return null;

    const value = control.value;
    const unit = this.settingsForm.get(`sla.${field}Unit`)?.value;

    if (field === 'responseTime') {
      if (unit === 'minutes' && value < 5) {
        return 'Thời gian phản hồi quá ngắn có thể gây áp lực cho đội xử lý';
      }
      if (unit === 'hours' && value > 24) {
        return 'Thời gian phản hồi quá dài có thể ảnh hưởng trải nghiệm người dùng';
      }
    }

    if (field === 'completionTime') {
      if (unit === 'minutes' && value < 30) {
        return 'Thời gian xử lý quá ngắn có thể không khả thi';
      }
      if (unit === 'hours' && value > 168) {
        return 'Thời gian xử lý quá dài có thể không đáp ứng yêu cầu';
      }
    }

    return null;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get isDirty(): boolean {
    return this.settingsForm.dirty || this.selectedLogoFile !== null;
  }
}
