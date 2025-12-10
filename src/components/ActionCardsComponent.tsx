import React from 'react';

interface ActionCardsComponentProps {
  onTrackProgressClick?: () => void;
}

const ActionCardsComponent: React.FC<ActionCardsComponentProps> = ({ onTrackProgressClick }) => {
  const actions = [
    {
      icon: '🚨',
      title: 'Báo cáo sự cố',
      description: 'Gửi báo cáo mới (ảnh, video, GPS)',
      onClick: () => {
        try {
          window.history.pushState({}, '', '/incident-management');
          window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (e) {
          window.location.href = '/incident-management';
        }
      },
    },
    {
      icon: '🔄',
      title: 'Theo dõi tiến độ',
      description: 'Xem trạng thái xử lý báo cáo của bạn',
      onClick: onTrackProgressClick || (() => console.log('Theo dõi tiến độ')),
    },
    
    {
      icon: '💬',
      title: 'Chat hỗ trợ',
      description: 'Trao đổi trực tiếp với bộ phận xử lý',
      onClick: () => {
        // navigate to support chat page within the app
        try {
          window.history.pushState({}, '', '/support-chat');
          window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (e) {
          // fallback full navigation
          window.location.href = '/support-chat';
        }
      },
    },
  ];

  return (
    <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          type="button"
          className="flex items-center space-x-4 p-5 bg-white rounded-lg shadow hover:shadow-md text-left transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          onClick={() => action.onClick && action.onClick()}
        >
          <div className="text-3xl">{action.icon}</div>
          <div>
            <div className="font-semibold text-gray-800">{action.title}</div>
            <div className="text-sm text-gray-600">{action.description}</div>
          </div>
        </button>
      ))}
    </section>
  );
};

export default ActionCardsComponent;