

import React, { useState } from 'react';
import { Search, Filter, MapPin, MoreVertical, Eye, RefreshCw, Edit, X, MessageCircle, Truck, Package, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Whatsapp from "@/assets/whatsapp 1.svg";
import { Header, Pagination } from './RequestsList';

export function Orders() {
  const [activeTab, setActiveTab] = useState('orders');
  const [showMenu, setShowMenu] = useState(null);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;

  const orders = [
    {
      id: 1,
      medication: 'Metformin 500mg',
      patient: 'Adewale Ogunleye',
      count: '3 medications',
      orderId: 'ORD - 001',
      price: '₦20,000',
      avatar: '+4'
    },
    {
      id: 2,
      medication: 'Metformin 500mg',
      patient: 'Jane Hamilton',
      count: '2 medications',
      orderId: 'ORD - 002',
      price: '₦20,000',
      avatar: '+2'
    },
    {
      id: 3,
      medication: 'Metformin 500mg',
      patient: 'Sarah Chen',
      count: '1 medication',
      orderId: 'ORD - 003',
      price: '₦20,000',
      avatar: '+1',
      showPay: true
    },
    {
      id: 4,
      medication: 'Metformin 500mg',
      patient: 'Michael Brown',
      count: '5 medications',
      orderId: 'ORD - 004',
      price: '₦20,000',
      avatar: '+6'
    }
  ];

  const trackOrders = [
    {
      id: 1,
      medication: 'Lisinopril 10mg',
      patient: 'Chioma Nwankwo',
      count: '2 medications',
      orderId: 'ORD - 105',
      price: '₦15,000',
      avatar: '+2',
      status: 'delivered',
      deliveryDate: 'Oct 25, 2025',
      trackingNumber: 'TRK-45892',
      courierName: 'John Doe',
      courierPhone: '+234 801 234 5678',
      timeline: [
        { status: 'Order Placed', description: 'Your order has been confirmed', date: 'April 13, 2025, 10:00 AM', completed: true },
        { status: 'Processing', description: 'Your order is being prepared', date: 'April 14, 2025, 02:30 PM', completed: true },
        { status: 'Dispatched', description: 'Your order is on the way', date: 'April 15, 2025, 09:15 AM', completed: true },
        { status: 'In Transit', description: 'On the way to you', date: 'April 16, 2025, 11:45 AM', completed: true },
        { status: 'Delivered', description: 'Package delivered', date: 'April 17, 2025, 03:20 PM', completed: true }
      ]
    },
    {
      id: 2,
      medication: 'Amoxicillin 500mg',
      patient: 'Emeka Okafor',
      count: '4 medications',
      orderId: 'ORD - 106',
      price: '₦18,500',
      avatar: '+4',
      status: 'in-transit',
      estimatedDelivery: 'October 29, 2025',
      trackingNumber: 'TRK-45893',
      courierName: 'Sarah Johnson',
      courierPhone: '+234 802 345 6789',
      timeline: [
        { status: 'Order Placed', description: 'Your order has been confirmed', date: 'April 13, 2025, 10:00 AM', completed: true },
        { status: 'Processing', description: 'Your order is being prepared', date: 'April 14, 2025, 02:30 PM', completed: true },
        { status: 'Dispatched', description: 'Your order is on the way', date: 'April 15, 2025, 09:15 AM', completed: true },
        { status: 'In Transit', description: 'On the way to you', date: 'April 16, 2025, 11:45 AM', completed: true },
        { status: 'Delivered', description: 'Package delivered', date: '', completed: false }
      ]
    },
    {
      id: 3,
      medication: 'Atorvastatin 20mg',
      patient: 'Fatima Abdullahi',
      count: '3 medications',
      orderId: 'ORD - 107',
      price: '₦22,000',
      avatar: '+3',
      status: 'in-transit',
      estimatedDelivery: 'October 30, 2025',
      trackingNumber: 'TRK-45894',
      courierName: 'Michael Chen',
      courierPhone: '+234 803 456 7890',
      timeline: [
        { status: 'Order Placed', description: 'Your order has been confirmed', date: 'April 13, 2025, 10:00 AM', completed: true },
        { status: 'Processing', description: 'Your order is being prepared', date: 'April 14, 2025, 02:30 PM', completed: true },
        { status: 'Dispatched', description: 'Your order is on the way', date: 'April 15, 2025, 09:15 AM', completed: false },
        { status: 'In Transit', description: 'On the way to you', date: '', completed: false },
        { status: 'Delivered', description: 'Package delivered', date: '', completed: false }
      ]
    },
    {
      id: 4,
      medication: 'Omeprazole 40mg',
      patient: 'Ibrahim Musa',
      count: '1 medication',
      orderId: 'ORD - 108',
      price: '₦12,000',
      avatar: '+1',
      status: 'delivered',
      deliveryDate: 'Oct 26, 2025',
      trackingNumber: 'TRK-45895',
      courierName: 'David Wilson',
      courierPhone: '+234 804 567 8901',
      timeline: [
        { status: 'Order Placed', description: 'Your order has been confirmed', date: 'April 13, 2025, 10:00 AM', completed: true },
        { status: 'Processing', description: 'Your order is being prepared', date: 'April 14, 2025, 02:30 PM', completed: true },
        { status: 'Dispatched', description: 'Your order is on the way', date: 'April 15, 2025, 09:15 AM', completed: true },
        { status: 'In Transit', description: 'On the way to you', date: 'April 16, 2025, 11:45 AM', completed: true },
        { status: 'Delivered', description: 'Package delivered', date: 'April 17, 2025, 03:20 PM', completed: true }
      ]
    }
  ];

  const handleTrackPackage = (order) => {
    setSelectedOrder(order);
    setShowTrackModal(true);
    setShowMenu(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Tabs */}
        <div className="flex gap-8 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === 'orders'
                ? 'text-[#106FB2]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Orders (4)
            {activeTab === 'orders' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#106FB2]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === 'track'
                ? 'text-[#106FB2]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Track ({trackOrders.length})
            {activeTab === 'track' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#106FB2]"></div>
            )}
          </button>
        </div>

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-24 mb-8">
         <Header />
         {/* Right Sidebar (Need Help?) */}
         <div className="space-y-4">
           <div className="bg-blue-50 border border-blue-200 text-gray-800 py-2.5 px-4 rounded w-[300px] text-sm">
             These are verified requests from patients who need help sourcing for
             their medications. Your contribution can save lives.
           </div>

           <div className="bg-card rounded-lg shadow-md p-6">
             <div className="flex items-center gap-3 mb-4">
               <div className="bg-success/10 rounded-full ">
                 {/* <MessageCircle className="h-5 w-5 text-success" /> */}
                 <img src={Whatsapp} alt="whatsapp" className="w-10 h-10" />
               </div>
               <div>
                 <h3 className="text-sm font-normal text-neutral-800">
                   Need Help?
                 </h3>
                 <p className="text-xs text-neutral-500">
                   Our support team is available
                 </p>
               </div>
             </div>
             <Button className="w-full bg-[#106FB2] hover:bg-[#106FB2]/90 text-sm rounded-full">
               Chat with Support
             </Button>
           </div>
         </div>
       </div>

          {/* Conditional Rendering: Orders or Track */}
          {activeTab === 'orders' ? (
            /* Orders Grid */
            <div className="grid grid-cols-2 gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="relative border border-gray-200 rounded-lg p-4 flex justify-between items-start shadow-sm box-border"
                >
                  {/* LEFT SIDE: Avatar + Text Info */}
                  <div className="flex items-start gap-3">
                    <div className="text-[#106FB2] rounded-full w-[50px] h-[50px] flex-shrink-0 flex justify-center items-center text-sm font-bold bg-[#E1F8FF]">
                      {order.avatar}
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 -mb-2">{order.medication}</h4>
                      <p className="text-sm text-gray-500">{order.patient}</p>
                      <p className="m-0 text-xs text-gray-600">
                        {order.count} • {order.orderId}
                      </p>
                      <p className="mt-1 font-bold">{order.price}</p>
                    </div>
                  </div>

                  {/* RIGHT SIDE: Menu + Action Button */}
                  <div className="flex flex-col items-end justify-between h-full">
                    <button
                      onClick={() => setShowMenu(showMenu === order.id ? null : order.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {showMenu === order.id && (
                      <div className="absolute right-5 top-14 bg-[#106FB242] border border-gray-200 rounded-lg shadow-lg py-1 z-10 w-36">
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:text-[#106FB2] flex items-center gap-2">
                          <Eye size={16} />
                          View
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:text-[#106FB2] flex items-center gap-2">
                          <RefreshCw size={16} />
                          Refill
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:text-[#106FB2] flex items-center gap-2">
                          <Edit size={16} />
                          Edit
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:text-[#106FB2] flex items-center gap-2">
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    )}

                    {order.showPay && (
                      <div className="mt-8">
                        <button className="py-1.5 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                          Pay
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Track Orders Grid */
            <div className="grid grid-cols-2 gap-4">
              {trackOrders.map((order) => (
                <div
                  key={order.id}
                  className="relative border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  {/* Header: Avatar + Menu */}
                  <div className="flex justify-end mb-3">
                    <button
                      onClick={() => setShowMenu(showMenu === order.id ? null : order.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {showMenu === order.id && (
                      <div className="absolute right-5 top-14 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 w-36">
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Eye size={16} />
                          View Details
                        </button>
                        <button 
                          onClick={() => handleTrackPackage(order)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Package size={16} />
                          Track Package
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Order Info */}
                  <div className="flex gap-4">
                  <div className="text-[#106FB2] rounded-full w-[50px] h-[50px] flex-shrink-0 flex justify-center items-center text-sm font-bold bg-[#E1F8FF]">
                      {order.avatar}
                    </div>
                    <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-gray-900">{order.medication}</h4>
                    <p className="text-sm text-gray-500">{order.patient}</p>
                    <p className="text-xs text-gray-600">
                      {order.count} • {order.orderId}
                    </p>
                    <p className="text-xs text-gray-500">Tracking: {order.trackingNumber}</p>
                    <p className="font-bold text-gray-900">{order.price}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="border-t border-gray-200 pt-3">
                    {order.status === 'delivered' ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package size={18} className="text-green-600" />
                          <span className="text-sm font-medium text-green-600">Delivered</span>
                        </div>
                        <span className="text-xs text-gray-500">{order.deliveryDate}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck size={18} className="text-[#106FB2]" />
                          <span className="text-sm font-medium text-[#106FB2]">In Transit</span>
                        </div>
                        <span className="text-xs text-gray-500">ETA: {order.estimatedDelivery}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {/* <div className="flex justify-center items-center gap-2 mt-6">
            <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50">
              ‹
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50">
              3
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50">
              4
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50">
              ›
            </button>
          </div> */}

<Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        </div>
      </div>

      {/* Track Order Modal */}
      {showTrackModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Track Order</h2>
              <button
                onClick={() => setShowTrackModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* Order Info */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="font-semibold text-gray-900">{selectedOrder.orderId}</p>
                <p className="text-xs text-gray-500">Tracking: {selectedOrder.trackingNumber}</p>
              </div>

              {/* Estimated Delivery */}
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Estimated Delivery</p>
                <p className="text-sm font-semibold text-green-700">
                  {selectedOrder.status === 'delivered' ? selectedOrder.deliveryDate : selectedOrder.estimatedDelivery}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#106FB2] transition-all duration-300"
                    style={{ width: `${(selectedOrder.timeline.filter(t => t.completed).length / selectedOrder.timeline.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tracking Timeline</h3>
                <div className="space-y-4">
                  {selectedOrder.timeline.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      {/* Timeline Indicator */}
                      <div className="flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          item.completed 
                            ? 'bg-[#106FB2] border-[#106FB2]' 
                            : 'bg-white border-gray-300'
                        }`}>
                          {item.completed && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        {index < selectedOrder.timeline.length - 1 && (
                          <div className={`w-0.5 h-12 ${
                            item.completed ? 'bg-[#106FB2]' : 'bg-gray-300'
                          }`}></div>
                        )}
                      </div>

                      {/* Timeline Content */}
                      <div className="flex-1 pb-4">
                        <p className={`font-medium ${item.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                          {item.status}
                        </p>
                        <p className={`text-xs ${item.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                          {item.description}
                        </p>
                        {item.date && (
                          <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courier Information */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="font-semibold text-gray-900 mb-2">Courier Information</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-700">{selectedOrder.courierName}</p>
                  <button className="flex items-center gap-2 text-[#106FB2] text-sm hover:underline">
                    <Phone size={14} />
                    Call Courier
                  </button>
                </div>
              </div>

              {/* Delivery Tips */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 text-sm mb-2">Delivery Tips</h4>
                <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                  <li>Please be available to receive the package</li>
                  <li>Ensure your delivery address is correct</li>
                  <li>Contact the courier if issues arise</li>
                  <li>Confirm that your address is correct and your phone number is correct</li>
                </ul>
              </div>

              {/* Action Button */}
              <button className="w-full bg-[#106FB2] hover:bg-[#106FB2]/90 text-white py-2.5 rounded-lg font-medium">
                Track Another Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}