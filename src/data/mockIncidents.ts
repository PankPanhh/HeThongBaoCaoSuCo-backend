import { Incident } from '@/types/incident';

export const ALL_MOCK_INCIDENTS: Incident[] = [
  { id: '1', 
    type: 'Cây đổ', 
    location: 'Quận 7', 
    status: 'Đang xử lý', 
    time: '5 giờ trước', 
    description: '', 
    media: ['/static/incidents/caydo.jpg'], 
    history: [{ time: '6 giờ trước', status: 'Đã gửi' }]},
  { id: '2', type: 'Hư hỏng mặt đường', location: 'Thủ Đức', status: 'Đã gửi', time: '6 giờ trước', description: 'Ổ gà lớn gây nguy hiểm cho xe máy, cần vá ngay.', media: ['/static/incidents/caydo.jpg'], history: [{ time: '6 giờ trước', status: 'Đã gửi' }] },
  { id: '3', type: 'Ngập nước', location: 'Quận 4', status: 'Đã xử lý', time: '7 giờ trước', description: 'Ngập cục bộ sau mưa, đã được hút nước.', media: ['/static/incidents/huhongmatduong.webp'], history: [{ time: '8 giờ trước', status: 'Đã gửi' }, { time: '7 giờ trước', status: 'Đã xử lý' }] },
  { id: '4', type: 'Đèn đường hỏng', location: 'Quận 5', status: 'Đã gửi', time: '8 giờ trước', description: 'Cột đèn số 23 không sáng vào ban đêm.', media: ['/static/incidents/denhong.webp'], history: [{ time: '8 giờ trước', status: 'Đã gửi' }] },
  { id: '5', type: 'Rác tràn', location: 'Bình Chánh', status: 'Đang xử lý', time: '1 ngày trước', description: 'Xe rác bị trục trặc, rác tràn nhiều quanh bãi tập kết.', media: ['/static/incidents/ractran.jpg'], history: [{ time: '1 ngày trước', status: 'Đã gửi' }, { time: '20 giờ trước', status: 'Đang xử lý' }] },
  { id: '6', type: 'Ngập nước', location: 'Quận 10', status: 'Đã xử lý', time: '2 ngày trước', description: 'Ống cống bị tắc, đã thông và xử lý.', media: ['/static/incidents/ngapnuoc.webp'], history: [{ time: '2 ngày trước', status: 'Đã xử lý' }] },
  { id: '7', type: 'Cây đổ', location: 'Quận 1', status: 'Đã xử lý', time: '3 ngày trước', description: 'Cây xanh bật gốc do gió mạnh, đã được cắt và dọn.', media: ['/static/incidents/caydo.jpg'], history: [{ time: '3 ngày trước', status: 'Đã xử lý' }] },
];

export default ALL_MOCK_INCIDENTS;
