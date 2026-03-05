import React from 'react'
import { Icon, Page } from 'zmp-ui'

import { PageContainer } from '@/components'
import { MerchantLayout, MerchantTabs } from '@/modules/merchants/components'

type TimesheetStatus = 'on-time' | 'late' | 'absent' | 'overtime'
type ShiftType = 'morning' | 'afternoon' | 'night' | 'off'

type TimesheetItem = {
  id: number
  weekday: string
  date: string
  shift: string
  shiftType: ShiftType
  checkIn: string
  checkOut: string
  status: TimesheetStatus
}

const TIMESHEET_ITEMS: TimesheetItem[] = [
  {
    id: 1,
    weekday: 'Thứ Hai',
    date: '23/02/2026',
    shift: 'Sáng',
    shiftType: 'morning',
    checkIn: '08:02',
    checkOut: 'Ra 12:01',
    status: 'on-time',
  },
  {
    id: 2,
    weekday: 'Thứ Ba',
    date: '24/02/2026',
    shift: 'Chiều',
    shiftType: 'afternoon',
    checkIn: '13:00',
    checkOut: 'Ra 17:05',
    status: 'on-time',
  },
  {
    id: 3,
    weekday: 'Thứ Tư',
    date: '25/02/2026',
    shift: 'Sáng',
    shiftType: 'morning',
    checkIn: '08:15',
    checkOut: 'Ra 12:00',
    status: 'late',
  },
  {
    id: 4,
    weekday: 'Thứ Năm',
    date: '26/02/2026',
    shift: 'Chiều',
    shiftType: 'afternoon',
    checkIn: '13:01',
    checkOut: 'Ra 17:00',
    status: 'on-time',
  },
  {
    id: 5,
    weekday: 'Thứ Sáu',
    date: '27/02/2026',
    shift: 'Nghỉ làm',
    shiftType: 'off',
    checkIn: '00:00',
    checkOut: 'Để nào',
    status: 'absent',
  },
  {
    id: 6,
    weekday: 'Thứ Bảy',
    date: '28/02/2026',
    shift: 'Tối',
    shiftType: 'night',
    checkIn: '18:00',
    checkOut: '22:30',
    status: 'overtime',
  },
]

const SHIFT_DOT_CLASS: Record<ShiftType, string> = {
  morning: 'bg-[#2f82e8]',
  afternoon: 'bg-[#63bf66]',
  night: 'bg-[#7f6fd5]',
  off: 'bg-transparent',
}

const STATUS_CLASS: Record<TimesheetStatus, string> = {
  'on-time': 'bg-[#d8ecda] text-[#247738]',
  late: 'bg-[#f5e7ca] text-[#996407]',
  absent: 'bg-[#f6dddd] text-[#b83c37]',
  overtime: 'bg-[#f6e4c7] text-[#a3670b]',
}

function StatusBadge({ status }: { status: TimesheetStatus }) {
  if (status === 'on-time') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[13px] font-medium leading-none ${STATUS_CLASS[status]}`}
      >
        <Icon icon="zi-check" size={14} />
        Đúng giờ
      </span>
    )
  }

  if (status === 'late') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[13px] font-medium leading-none ${STATUS_CLASS[status]}`}
      >
        Đi muộn (15 phút)
      </span>
    )
  }

  if (status === 'absent') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[13px] font-medium leading-none ${STATUS_CLASS[status]}`}
      >
        <Icon icon="zi-close" size={14} />
        Nghỉ không phép
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[13px] font-medium leading-none ${STATUS_CLASS[status]}`}
    >
      Làm thêm giờ
    </span>
  )
}

function ShiftMarker({ type }: { type: ShiftType }) {
  if (type === 'off') {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full text-[#e04941]">
        <Icon icon="zi-close" size={16} />
      </span>
    )
  }

  return <span className={`h-5 w-5 rounded-full ${SHIFT_DOT_CLASS[type]}`} />
}

export default function MerchantTimesheetPage() {
  return (
    <MerchantLayout>
      <Page restoreScroll className="bg-[#e8edf2]">
        <PageContainer withBottomNav noInsetTop>
          <header className="inset-top flex h-[calc(var(--zaui-safe-area-inset-top,0px)+60px)] items-center justify-between border-b border-[#e6ebf0] bg-white px-4">
            <h1 className="text-[18px] font-bold leading-none text-[#121826]">Bảng chấm công</h1>
            <div className="flex h-[44px] items-center overflow-hidden rounded-full border border-[#d4d8de] bg-white">
              <button className="h-[44px] w-[44px] border-none bg-transparent text-[#1a2330]">
                <Icon icon="zi-more-grid" size={20} />
              </button>
              <div className="h-6 w-px bg-[#d4d8de]" />
              <button className="h-[44px] w-[44px] border-none bg-transparent text-[#1a2330]">
                <Icon icon="zi-close" size={20} />
              </button>
            </div>
          </header>

          <div className="border-b border-[#e6ebf0] bg-white px-4 py-2.5">
            <div className="flex gap-2">
              <button className="inline-flex h-10 items-center gap-2 rounded-full border border-[#c8d5e8] bg-[#dce7f6] px-4 text-[16px] font-medium text-[#1f74d8]">
                Tuần này
                <Icon icon="zi-arrow-down" size={14} />
              </button>
              <button className="inline-flex h-10 items-center gap-2 rounded-full border border-[#d9dee6] bg-[#eef1f5] px-4 text-[16px] font-medium text-[#2e3440]">
                Tất cả trạng thái
                <Icon icon="zi-arrow-down" size={14} />
              </button>
            </div>
          </div>

          <main className="space-y-2.5 p-3">
            {TIMESHEET_ITEMS.map((item, index) => (
              <section key={item.id} className="rounded-3xl bg-[#f7f8fa] p-4">
                <div className="text-[18px] font-semibold leading-tight text-[#101828]">
                  <span className="font-bold">{item.weekday}, </span>
                  <span className="font-medium text-[#4b5563]">{item.date}</span>
                </div>

                <div className="mt-2.5 flex items-center gap-3 text-[17px] font-medium text-[#1a2330]">
                  <ShiftMarker type={item.shiftType} />
                  <span>{item.shift}</span>
                </div>

                <div className="mt-2 flex items-end justify-between gap-2">
                  <div className="border-l border-[#d4d9e2] pl-4 text-[17px] leading-tight">
                    <span className={item.status === 'absent' ? 'text-[#9aa3b2]' : 'text-[#121926]'}>
                      {item.checkIn}
                    </span>
                    <span className="mx-2 text-[#9aa3b2]">-&gt;</span>
                    <span className={item.status === 'absent' ? 'text-[#9aa3b2]' : 'text-[#273142]'}>
                      {item.checkOut}
                    </span>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                {index === TIMESHEET_ITEMS.length - 1 && (
                  <div className="mt-4 rounded-2xl bg-[#eaf0f7] p-3.5 text-[#2b3442]">
                    <div className="flex items-center justify-between text-[16px]">
                      <span>Tổng kết tuần</span>
                      <span>
                        Tổng giờ làm: <strong>20h18p</strong>
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[15px] leading-tight">
                      <span>
                        Đi muộn: <strong>1 lần</strong>
                      </span>
                      <span className="h-5 w-px bg-[#cad3df]" />
                      <span>
                        Nghỉ: <strong className="text-[#1f74d8]">1 ngày</strong>
                      </span>
                      <span className="h-5 w-px bg-[#cad3df]" />
                      <span>
                        Làm thêm: <strong>1 ca</strong>
                      </span>
                    </div>
                  </div>
                )}
              </section>
            ))}
          </main>
        </PageContainer>
      </Page>
      <MerchantTabs activeTab="stock-check" />
    </MerchantLayout>
  )
}
