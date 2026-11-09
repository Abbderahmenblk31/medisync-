'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    name: 'Command Center',
    href: '/',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    badge: 'Live',
  },
  {
    name: 'Appointments',
    href: '/appointments',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'Patients & EMR',
    href: '/patients',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    name: 'Clinical Charting',
    href: '/consultation/APT-4091',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    name: 'Billing & Claims',
    href: '/billing',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="p-3 space-y-1 flex-1">
      <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Clinical Operations
      </div>
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </div>
            {item.badge && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function ClinicSidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              MediSync <span className="text-[10px] font-semibold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded">EMR</span>
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Clinical Practice OS</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links wrapped in Suspense */}
      <Suspense fallback={<div className="p-4 text-xs text-slate-400">Loading navigation...</div>}>
        <SidebarNav />
      </Suspense>

      {/* Practice Status Card */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Clinic Station
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            Active
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Metropolitan Central Clinic
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          Station #4 • Wing B
        </p>
      </div>

      {/* Active Clinician Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center border border-sky-300 dark:border-sky-800">
            SC
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Dr. Sarah Chen</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Cardiology Dept</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
