import React from 'react';

const ActionCardsComponent: React.FC = () => {
  const actions = [
    {
      icon: '🚨',
      title: 'Báo cáo sự cố',
      description: 'Gửi báo cáo mới (ảnh, video, GPS)',
      onClick: () => console.log('Báo cáo sự cố'),
    },
    {
      icon: '🔄',
      title: 'Theo dõi tiến độ',
      description: 'Xem trạng thái xử lý báo cáo của bạn',
      onClick: () => console.log('Theo dõi tiến độ'),
    },
    
    {
      icon: '💬',
      title: 'Chat hỗ trợ',
      description: 'Trao đổi trực tiếp với bộ phận xử lý',
      onClick: () => console.log('Chat hỗ trợ'),
    },
  ];

  return (
    <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          className="flex items-center space-x-4 p-5 bg-white rounded-lg shadow hover:shadow-md text-left transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={action.onClick}
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