import { useEffect, useState } from 'react';
import { BarChart3, DollarSign, Home, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import { supabase, Property, Payment } from '../lib/supabase';

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: propsData } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .order('due_date', { ascending: false });

      setProperties(propsData || []);
      setPayments(paymentsData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const totalProperties = properties.length;
  const activeProperties = properties.filter(p => p.status === 'active').length;
  const totalRent = properties.reduce((sum, p) => sum + Number(p.monthly_rent), 0);

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalOverdue = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + Number(p.amount), 0);

  const upcomingPayments = payments
    .filter(p => p.status === 'pending')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  const overduePayments = payments.filter(p => p.status === 'overdue');

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.property_id : 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard Overview</h2>
        <p className="text-gray-600">Monitor your property portfolio and payment status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Home className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 opacity-70" />
          </div>
          <p className="text-blue-100 text-sm mb-1">Total Properties</p>
          <p className="text-3xl font-bold">{totalProperties}</p>
          <p className="text-blue-100 text-xs mt-2">{activeProperties} active</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <BarChart3 className="w-5 h-5 opacity-70" />
          </div>
          <p className="text-green-100 text-sm mb-1">Total Paid</p>
          <p className="text-3xl font-bold">{formatCurrency(totalPaid)}</p>
          <p className="text-green-100 text-xs mt-2">All time</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Calendar className="w-6 h-6" />
            </div>
            <AlertCircle className="w-5 h-5 opacity-70" />
          </div>
          <p className="text-yellow-100 text-sm mb-1">Pending Payments</p>
          <p className="text-3xl font-bold">{formatCurrency(totalPending)}</p>
          <p className="text-yellow-100 text-xs mt-2">{payments.filter(p => p.status === 'pending').length} items</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 opacity-70 rotate-180" />
          </div>
          <p className="text-red-100 text-sm mb-1">Overdue Payments</p>
          <p className="text-3xl font-bold">{formatCurrency(totalOverdue)}</p>
          <p className="text-red-100 text-xs mt-2">{overduePayments.length} items</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Payments</h3>
          </div>
          <div className="p-6">
            {upcomingPayments.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No upcoming payments</p>
            ) : (
              <div className="space-y-4">
                {upcomingPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {getPropertyName(payment.property_id)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {payment.payment_type.charAt(0).toUpperCase() + payment.payment_type.slice(1)} - Due {formatDate(payment.due_date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(Number(payment.amount))}</p>
                      <span className="text-xs text-yellow-600 font-medium">Pending</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Overdue Payments</h3>
          </div>
          <div className="p-6">
            {overduePayments.length === 0 ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-gray-500">No overdue payments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {overduePayments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {getPropertyName(payment.property_id)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {payment.payment_type.charAt(0).toUpperCase() + payment.payment_type.slice(1)} - Due {formatDate(payment.due_date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(Number(payment.amount))}</p>
                      <span className="text-xs text-red-600 font-medium">Overdue</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Property Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Property ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Monthly Rent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No properties found
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                      {property.property_id}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{property.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {property.tenant_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                      {formatCurrency(Number(property.monthly_rent))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          property.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : property.status === 'vacant'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
