'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PackageOpen,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  Loader,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  totalProducts: number;
  totalRevenue: number;
  lowStockItems: number;
  deliveredOrders: number;
  processingOrders: number;
  cancelledOrders: number;
}

interface Order {
  id: string;
  userId: string;
  status: string;
  createdAt: string;
  totalAmount: string | number;
  user?: {
    name: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [salesData, setSalesData] = useState<Array<{ month: string; sales: number }>>([]);
  const [orderStatusData, setOrderStatusData] = useState<
    Array<{ name: string; value: number; color: string; count: number }>
  >([]);

  const processOrdersForCharts = (orders: Order[]) => {
    // Process sales data by month
    const salesByMonth = orders.reduce(
      (acc, order) => {
        const date = new Date(order.createdAt);
        const monthKey = date.toLocaleString('default', { month: 'short' });

        if (!acc[monthKey]) {
          acc[monthKey] = 0;
        }
        acc[monthKey] += parseFloat(String(order.totalAmount || 0));
        return acc;
      },
      {} as Record<string, number>
    );

    // Convert to chart format and sort by month
    const monthOrder = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const salesChartData = monthOrder
      .filter(month => salesByMonth[month])
      .map(month => ({
        month,
        sales: Math.round(salesByMonth[month]),
      }));

    setSalesData(salesChartData);

    // Process order status data
    const statusCounts = orders.reduce(
      (acc, order) => {
        const status = order.status || 'PENDING';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalOrders = orders.length;
    const statusColors = {
      DELIVERED: '#10B981',
      PROCESSING: '#3B82F6',
      PENDING: '#F59E0B',
      CANCELLED: '#EF4444',
      SHIPPED: '#8B5CF6',
    };

    const statusChartData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0) + status.slice(1).toLowerCase(),
      value: parseFloat((((count as number) / totalOrders) * 100).toFixed(1)),
      color: statusColors[status as keyof typeof statusColors] || '#6B7280',
      count: count as number,
    }));

    setOrderStatusData(statusChartData);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all orders to calculate stats and charts
        const ordersRes = await fetch('/api/admin/orders?page=1&limit=1000');
        const ordersData = await ordersRes.json();

        if (!ordersData.success) {
          throw new Error('Failed to fetch orders');
        }

        const allOrders = ordersData.orders || [];

        // Calculate statistics from orders
        const totalOrders = allOrders.length;
        const pendingOrders = allOrders.filter((order: Order) => order.status === 'PENDING').length;
        const deliveredOrders = allOrders.filter(
          (order: Order) => order.status === 'DELIVERED'
        ).length;
        const processingOrders = allOrders.filter(
          (order: Order) => order.status === 'PROCESSING'
        ).length;
        const cancelledOrders = allOrders.filter(
          (order: Order) => order.status === 'CANCELLED'
        ).length;

        // Calculate total revenue
        const totalRevenue = allOrders.reduce((sum: number, order: Order) => {
          return sum + parseFloat(String(order.totalAmount || 0));
        }, 0);

        // Get unique customers
        const uniqueCustomers: number = new Set(allOrders.map((order: Order) => order.userId)).size;

        // For products and low stock, you'll need to fetch from products API
        let totalProducts = 0;
        let lowStockItems = 0;

        try {
          const productsRes = await fetch('/api/admin/products?page=1&limit=1000');
          const productsData = await productsRes.json();

          if (productsData.success) {
            totalProducts = productsData.products?.length || 0;
            // Define product interface
            interface Product {
              id?: string;
              name?: string;
              price?: number;
              stockQuantity?: number;
              description?: string;
              imageUrl?: string;
              categoryId?: string;
              createdAt?: string;
              updatedAt?: string;
            }

            // Use the interface in the filter
            lowStockItems =
              ((productsData.products as Product[]) || []).filter(
                product => (product.stockQuantity || 0) < 10
              ).length || 0;
          }
        } catch (productsError) {
          console.warn('Could not fetch products data:', productsError);
        }

        const calculatedStats = {
          totalOrders,
          pendingOrders,
          totalCustomers: uniqueCustomers,
          totalProducts,
          totalRevenue,
          lowStockItems,
          deliveredOrders,
          processingOrders,
          cancelledOrders,
        };

        setStats(calculatedStats);

        // Process data for charts
        processOrdersForCharts(allOrders);

        // Set recent orders (first 5)
        setRecentOrders(allOrders.slice(0, 5));

        setLoading(false);
      } catch (err: unknown) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <h2 className="text-lg font-medium">Error loading dashboard</h2>
          <p>{error || 'Unknown error occurred'}</p>
        </div>
      </div>
    );
  }

  // Calculate percentage changes (you can enhance this by comparing with previous period data)
  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: <PackageOpen className="h-6 w-6 text-blue-600" />,
      iconBg: 'bg-blue-100',
      change: '+12%',
      changeText: 'from last month',
      isPositive: true,
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      iconBg: 'bg-green-100',
      change: '+8.2%',
      changeText: 'from last month',
      isPositive: true,
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: <ShoppingBag className="h-6 w-6 text-purple-600" />,
      iconBg: 'bg-purple-100',
      change: '+24',
      changeText: 'new this month',
      isPositive: true,
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems.toString(),
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      iconBg: 'bg-red-100',
      change: '+3',
      changeText: 'since yesterday',
      isPositive: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, index) => (
            <div key={index} className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="mb-2 text-3xl font-bold text-gray-900">{card.value}</p>
                  <div className="flex items-center text-sm">
                    {card.isPositive ? (
                      <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                    )}
                    <span className={card.isPositive ? 'text-green-600' : 'text-red-600'}>
                      {card.change}
                    </span>
                    <span className="ml-1 text-gray-500">{card.changeText}</span>
                  </div>
                </div>
                <div className={`rounded-full p-3 ${card.iconBg}`}>{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Sales Overview Chart */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Sales Overview</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Status Pie Chart */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Status</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value}% (${props.payload.count} orders)`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              {orderStatusData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="mr-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              View all
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-blue-600">
                      <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                        #{order.id.slice(-6)}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                      {order.user?.name || 'Unknown Customer'}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                      ₹{Number(order.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${
                          order.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'PROCESSING'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : order.status === 'SHIPPED'
                                  ? 'bg-purple-100 text-purple-800'
                                  : order.status === 'CANCELLED'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
