import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { BarChart, FileText, Clock, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import Layout from '@/components/Layout';
import { Post, QnA, Schedule } from '@/types';
import { formatDateKST } from '@/utils/helpers';

interface AdminDashboardProps {
  kpis: {
    pageviews7d: number;
    published7d: number;
    pendingApprovals: number;
    failures: number;
  };
  pendingContent: Post[];
  todaySchedule: Schedule[];
}

export default function AdminDashboard({ kpis, pendingContent, todaySchedule }: AdminDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(timer);
  }, []);

  return (
    <Layout title="Admin Dashboard" noIndex={true}>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Current time (KST): {formatDateKST(currentTime.toISOString())}
            </p>
          </div>

          {/* KPI 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pageviews (7d)</p>
                  <p className="text-2xl font-bold text-gray-900">{kpis.pageviews7d.toLocaleString()}</p>
                </div>
                <BarChart className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published (7d)</p>
                  <p className="text-2xl font-bold text-gray-900">{kpis.published7d}</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900">{kpis.pendingApprovals}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failures</p>
                  <p className="text-2xl font-bold text-gray-900">{kpis.failures}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 승인 대기 콘텐츠 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {pendingContent.length > 0 ? (
                  pendingContent.map((content) => (
                    <div key={content.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 mb-1">
                            {content.title}
                          </h3>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span className={`px-2 py-1 rounded-full ${
                              content.status === 'Draft' ? 'bg-gray-100' :
                              content.status === 'Needs-Source' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {content.status}
                            </span>
                            <span>{content.category}</span>
                            <span>{formatDateKST(content.lastUpdatedKST)}</span>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            Sources: {content.sources.length}/2 required
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <button className="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700">
                            Edit
                          </button>
                          <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                            Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No content pending approval</p>
                  </div>
                )}
              </div>
            </div>

            {/* 오늘의 스케줄 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {todaySchedule.length > 0 ? (
                  todaySchedule.map((schedule) => (
                    <div key={schedule.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 mb-1">
                            Content ID: {schedule.contentId}
                          </div>
                          <div className="text-sm text-gray-600">
                            Publish at: {formatDateKST(schedule.publishAtKST)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Status: {schedule.status}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                            View
                          </button>
                          <button className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No content scheduled for today</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 빠른 액션 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <a
              href="/admin/content/new"
              className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-primary-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Create Content</h3>
                  <p className="text-sm text-gray-600">New post, QnA, or update</p>
                </div>
              </div>
            </a>

            <a
              href="/admin/widgets/cost-estimator"
              className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Update Costs</h3>
                  <p className="text-sm text-gray-600">Exchange rates and prices</p>
                </div>
              </div>
            </a>

            <a
              href="/admin/sources"
              className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Manage Sources</h3>
                  <p className="text-sm text-gray-600">RSS feeds and data sources</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // 실제로는 인증 체크 및 데이터베이스에서 데이터 로드
  // 현재는 Mock 데이터 사용
  
  const kpis = {
    pageviews7d: 15420,
    published7d: 12,
    pendingApprovals: 3,
    failures: 1
  };

  const pendingContent: Post[] = [
    {
      id: 'post-001',
      title: 'New K-ETA Requirements for Canadians',
      slug: 'k-eta-requirements-canadians',
      category: 'travel-food',
      language: 'en',
      tags: ['visa', 'k-eta', 'travel'],
      lastUpdatedKST: '2025-09-08T14:30:00+09:00',
      readingTimeMin: 5,
      seo: {
        description: 'Updated K-ETA requirements for Canadian travelers',
        keywords: ['k-eta', 'korea visa', 'canada']
      },
      status: 'Needs-Source',
      sources: [
        {
          title: 'Korea Immigration Service',
          url: 'https://example.com/immigration',
          publisher: 'KIS'
        }
      ],
      adsPolicy: {
        isSensitiveSection: true,
        topAdDisabled: true
      },
      body: 'Draft content about K-ETA requirements...'
    }
  ];

  const todaySchedule: Schedule[] = [
    {
      id: 'schedule-001',
      contentId: 'post-002',
      publishAtKST: '2025-09-08T18:00:00+09:00',
      createdAt: '2025-09-08T10:00:00+09:00',
      status: 'Scheduled'
    }
  ];

  return {
    props: {
      kpis,
      pendingContent,
      todaySchedule
    }
  };
};
