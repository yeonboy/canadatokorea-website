import Link from 'next/link';
import { Calculator, MapPin, AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const quickActions = [
  {
    href: '/tools/cost-estimator',
    icon: Calculator,
    title: 'Cost Comparison',
    description: 'Compare living costs between Canada and Korea',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600'
  },
  {
    href: '/real-korea-now?filter=popup',
    icon: MapPin,
    title: 'Today\'s Pop-ups',
    description: 'Latest pop-up stores and events in Seoul',
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-gradient-to-br from-purple-50 to-violet-50',
    iconBg: 'bg-gradient-to-br from-purple-500 to-violet-600'
  },
  {
    href: '/real-korea-now?filter=congestion',
    icon: AlertTriangle,
    title: 'Traffic Alerts',
    description: 'Real-time subway and traffic updates',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
    iconBg: 'bg-gradient-to-br from-orange-500 to-red-500'
  },
  {
    href: '/tools/qna',
    icon: HelpCircle,
    title: 'QnA Search',
    description: 'Find answers to common Korea questions',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600'
  }
];

export default function QuickActions() {
  return (
    <div className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <Container>
        <SectionHeader
          title="Get Started with Korea"
          subtitle="Quick access to the most useful tools and information for Canadians"
          center
          size="xl"
          gradient
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {quickActions.map((action) => {
            const IconComponent = action.icon;

            return (
              <Link
                key={action.href}
                href={action.href}
                className="group"
              >
                <Card
                  className={`p-8 ${action.bgColor} border-0 shadow-lg group-hover:shadow-2xl transition-all duration-300`}
                  interactive
                >
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${action.iconBg} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="h-8 w-8" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">
                      {action.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {action.description}
                    </p>

                    <div className="mt-4 flex items-center justify-center text-primary-600 group-hover:text-primary-700 transition-colors">
                      <span className="text-sm font-medium mr-2">Explore</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* 추가 CTA */}
        <div className="text-center mt-16">
          <Link
            href="/real-korea-now"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 group"
          >
            <span>Explore All Korea Updates</span>
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </Container>
    </div>
  );
}
