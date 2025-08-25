import { FileText, Package, TrendingUp } from 'react-feather'

export default [
	{
		id: 'reports',
		title: 'Reports',
		icon: <FileText size={20} />,
		children: [
			{
				id: 'sales-reports',
				title: 'Sales Reports',
				icon: <TrendingUp size={12} />,
				navLink: '/reports/list',
			},
			{
				id: 'inventory-reports',
				title: 'Inventory Reports',
				icon: <Package size={12} />,
				navLink: '/inventory-reports/list',
			},
		],
	},
]
