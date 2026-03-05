import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Icon, Page, Text } from 'zmp-ui'

import { PageContainer } from '@/components'
import { MerchantLayout, MerchantTabs } from '@/modules/merchants/components'

type SectionType = 'inventory' | 'shipping'
type InventoryMode = 'list' | 'new-item' | 'attributes'

type InventoryItem = {
  id: number
  name: string
  sku: string
  price: number
  stock: number
  imageUrl?: string
}

const INITIAL_ITEMS: InventoryItem[] = [
  { id: 1, name: 'Chân gà 1', sku: '8938544087398', price: 12000, stock: 5 },
  { id: 2, name: 'Bbl phô mai tam giác 7.l', sku: '6973697321342', price: 16000, stock: 10 },
  { id: 3, name: 'Bbl chocolate tam giác 7.l', sku: '6973697321373', price: 16000, stock: 10 },
  {
    id: 4,
    name: 'Bbl lúa mạch tam giác 7.l',
    sku: '6973697321359',
    price: 16000,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1574475884003-a7e2de85f03f?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 5,
    name: 'Kẹo mút cola',
    sku: '8935001718987',
    price: 4000,
    stock: 3,
    imageUrl: 'https://images.unsplash.com/photo-1581795669633-91ef7c9699a8?q=80&w=300&auto=format&fit=crop',
  },
]

const ATTRIBUTE_OPTIONS = ['BỊCH', 'MIẾNG', 'HỘP', '1 BÌ 20 THAN...', 'CHAI', 'THÙNG', 'LỐC']

function formatNumber(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function toNumber(raw: string) {
  const num = Number(raw.replace(/[^\d]/g, ''))
  if (!Number.isFinite(num)) return 0
  return num
}

type FieldProps = {
  label: string
  required?: boolean
  value?: string
  onChange?: (value: string) => void
  suffix?: React.ReactNode
  onClick?: () => void
  readOnly?: boolean
}

function Field({ label, required, value, onChange, suffix, onClick, readOnly }: FieldProps) {
  const clickable = Boolean(onClick)
  return (
    <button
      className="w-full rounded-2xl border border-[#c8cdd5] bg-[#f7f8fa] px-4 py-4 text-left"
      onClick={onClick}
      disabled={!clickable}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 grow">
          <div className="text-[18px] font-semibold text-[#7a8797]">
            {label}
            {required && <span className="text-[#e24b4b]"> *</span>}
          </div>
          {!readOnly && onChange && (
            <input
              className="mt-1 w-full border-none bg-transparent p-0 text-[17px] text-[#0f172a] outline-none"
              value={value || ''}
              onChange={(event) => onChange(event.target.value)}
            />
          )}
        </div>
        {suffix}
      </div>
    </button>
  )
}

export default function MerchantManagementPage() {
  const [params] = useSearchParams()
  const section = (params.get('section') || 'inventory') as SectionType
  const activeTab = section === 'shipping' ? 'shipping' : 'inventory'

  const [items, setItems] = useState<InventoryItem[]>(INITIAL_ITEMS)
  const [mode, setMode] = useState<InventoryMode>('list')
  const [fabOpen, setFabOpen] = useState(false)
  const [showStockModal, setShowStockModal] = useState(false)
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([])
  const [newItemType, setNewItemType] = useState<'product' | 'service'>('product')

  const [form, setForm] = useState({
    itemCode: '',
    barcode: '',
    name: '',
    category: '',
    brand: '',
    costPrice: '',
    sellingPrice: '',
    stock: '',
    minStock: '',
    maxStock: '',
  })

  const totalStock = useMemo(() => items.reduce((sum, item) => sum + item.stock, 0), [items])

  function openCreate(type: 'product' | 'service') {
    setFabOpen(false)
    setNewItemType(type)
    setMode('new-item')
  }

  function closeCreate() {
    setMode('list')
    setShowStockModal(false)
  }

  function saveNewItem() {
    if (!form.name.trim()) return
    const created: InventoryItem = {
      id: Date.now(),
      name: form.name.trim(),
      sku: form.barcode.trim() || form.itemCode.trim() || String(Date.now()).slice(-12),
      price: toNumber(form.sellingPrice),
      stock: toNumber(form.stock),
    }
    setItems((prev) => [created, ...prev])
    setForm({
      itemCode: '',
      barcode: '',
      name: '',
      category: '',
      brand: '',
      costPrice: '',
      sellingPrice: '',
      stock: '',
      minStock: '',
      maxStock: '',
    })
    setMode('list')
  }

  function renderShipping() {
    return (
      <div className="inset-top px-4 pt-4">
        <div className="rounded-2xl bg-white p-4">
          <Text className="text-[22px] font-bold text-[#111827]">Chuyển hàng</Text>
          <Text className="mt-2 text-[15px] text-[#667085]">Quản lý phiếu chuyển hàng đang được cập nhật.</Text>
        </div>
      </div>
    )
  }

  function renderInventoryList() {
    return (
      <div className="inset-top pb-6">
        <div className="rounded-b-3xl bg-white px-4 pb-4 pt-3">
          <div className="flex items-center justify-between">
            <Text className="text-[28px] font-bold leading-none text-[#101828]">Hàng hoá</Text>
            <div className="flex items-center gap-0.5">
              <button className="h-9 w-9 rounded-full border-none bg-transparent text-[#6b7888]">
                <Icon icon="zi-search" size={20} />
              </button>
              <button className="h-9 w-9 rounded-full border-none bg-transparent text-[#6b7888]">
                <Icon icon="zi-arrow-up" size={20} />
              </button>
              <button className="h-9 w-9 rounded-full border-none bg-transparent text-[#6b7888]">
                <Icon icon="zi-more-grid" size={19} />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
            <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-none bg-[#edf0f4] text-[#5f6d7d]">
              <Icon icon="zi-filter" size={18} />
            </button>
            <button className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border-none bg-[#edf0f4] px-4 text-[16px] font-semibold text-[#1f2937]">
              Tất cả loại hàng
              <Icon icon="zi-arrow-down" size={14} />
            </button>
            <button className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border-none bg-[#edf0f4] px-4 text-[16px] font-semibold text-[#1f2937]">
              Giá bán
              <Icon icon="zi-arrow-down" size={14} />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div>
              <Text className="text-[22px] font-bold leading-none text-[#111827]">Tổng tồn</Text>
              <Text className="mt-2 text-[16px] font-semibold text-[#111827]">
                {formatNumber(items.length)} hàng hoá
              </Text>
            </div>
            <Text className="text-[22px] font-bold leading-none text-[#111827]">{formatNumber(totalStock)}.3</Text>
          </div>
        </div>

        <div className="mt-3 space-y-0 rounded-3xl bg-white">
          {items.map((item, index) => (
            <div key={item.id} className="px-4 py-4">
              <div className="grid grid-cols-[64px_minmax(0,1fr)_auto] gap-3">
                <div className="h-16 w-16 overflow-hidden rounded-2xl bg-[#dbe5f2]">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#7ea8dc]">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <circle cx="8" cy="8" r="2.7" fill="currentColor" />
                        <path d="M3 18L8 12L11.5 15.5L15 10L21 18H3Z" fill="currentColor" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <Text className="line-clamp-2 text-[18px] font-bold leading-tight text-[#111827]">{item.name}</Text>
                  <Text className="mt-1 text-[16px] font-semibold text-[#6a7788]">{item.sku}</Text>
                </div>
                <div className="text-right">
                  <Text className="text-[18px] font-bold leading-tight text-[#111827]">{formatNumber(item.price)}</Text>
                  <Text className="mt-1 text-[18px] font-bold leading-tight text-[#6a7788]">Tồn: {item.stock}</Text>
                </div>
              </div>
              {index !== items.length - 1 && <div className="ml-[76px] mt-4 h-px bg-[#eceff4]" />}
            </div>
          ))}
        </div>

        {fabOpen && <div className="fixed inset-0 z-20 bg-black/35" onClick={() => setFabOpen(false)} />}

        <div className="fixed bottom-[calc(var(--bottom-nav-height)+var(--zaui-safe-area-inset-bottom,0px)+16px)] right-5 z-30 flex flex-col items-end gap-2.5">
          {fabOpen && (
            <>
              <button
                className="rounded-2xl border-none bg-white px-5 py-2.5 text-[20px] font-bold text-[#111827] shadow-[0_6px_20px_rgba(15,23,42,0.16)]"
                onClick={() => openCreate('product')}
              >
                Thêm hàng hóa
              </button>
              <button
                className="rounded-2xl border-none bg-white px-5 py-2.5 text-[20px] font-bold text-[#111827] shadow-[0_6px_20px_rgba(15,23,42,0.16)]"
                onClick={() => openCreate('service')}
              >
                Thêm dịch vụ
              </button>
            </>
          )}

          <button
            className="flex h-16 w-16 items-center justify-center rounded-full border-none bg-[#1473e6] text-white shadow-[0_10px_30px_rgba(20,115,230,0.5)]"
            onClick={() => setFabOpen((prev) => !prev)}
          >
            <Icon icon={fabOpen ? 'zi-close' : 'zi-plus'} size={30} />
          </button>
        </div>
      </div>
    )
  }

  function renderCreateItem() {
    return (
      <div className="inset-top pb-4">
        <header className="flex h-[60px] items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button className="h-9 w-9 border-none bg-transparent text-[#6f7c8d]" onClick={closeCreate}>
              <Icon icon="zi-close" size={22} />
            </button>
            <Text className="text-[26px] font-bold text-[#111827]">
              {newItemType === 'service' ? 'Dịch vụ mới' : 'Hàng hoá mới'}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <button className="border-none bg-transparent text-[24px] font-bold text-[#1577ea]" onClick={saveNewItem}>
              Lưu
            </button>
            <button className="h-9 w-9 border-none bg-transparent text-[#6f7c8d]">
              <span className="text-[22px]">...</span>
            </button>
          </div>
        </header>

        <div className="rounded-3xl bg-white px-4 py-4">
          <button className="flex h-32 w-32 items-center justify-center rounded-3xl border-none bg-[#dbe5f2] text-[#3482e5]">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="6" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M8 13L10.4 10L12.5 12.6L15.8 8.8" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="18.5" cy="16.5" r="4" fill="#f7f8fa" stroke="currentColor" strokeWidth="1.8" />
              <path d="M18.5 14.8V18.2M16.8 16.5H20.2" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>

          <div className="mt-4 space-y-3">
            <Field
              label="Mã hàng"
              value={form.itemCode}
              onChange={(value) => setForm((prev) => ({ ...prev, itemCode: value }))}
              suffix={<Icon icon="zi-qrscanner" size={22} className="text-[#6f7c8d]" />}
            />
            <Field
              label="Mã vạch"
              value={form.barcode}
              onChange={(value) => setForm((prev) => ({ ...prev, barcode: value }))}
              suffix={<Icon icon="zi-qrscanner" size={22} className="text-[#6f7c8d]" />}
            />
            <Field
              label="Tên hàng"
              required
              value={form.name}
              onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
            />
            <Field
              label="Nhóm hàng"
              required
              value={form.category}
              onChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
              suffix={<Icon icon="zi-arrow-right" size={20} className="text-[#6f7c8d]" />}
              onClick={() => setMode('attributes')}
              readOnly
            />
            <Field
              label="Thương hiệu"
              value={form.brand}
              onChange={(value) => setForm((prev) => ({ ...prev, brand: value }))}
              suffix={<Icon icon="zi-arrow-right" size={20} className="text-[#6f7c8d]" />}
              onClick={() => setMode('attributes')}
              readOnly
            />
            <Field
              label="Giá vốn"
              value={form.costPrice}
              onChange={(value) => setForm((prev) => ({ ...prev, costPrice: value }))}
            />
            <Field
              label="Giá bán"
              value={form.sellingPrice}
              onChange={(value) => setForm((prev) => ({ ...prev, sellingPrice: value }))}
              suffix={<Icon icon="zi-note" size={20} className="text-[#2a7de4]" />}
            />
            <Field
              label="Tồn kho"
              value={form.stock}
              onChange={(value) => setForm((prev) => ({ ...prev, stock: value }))}
              onClick={() => setShowStockModal(true)}
            />
          </div>
        </div>

        {showStockModal && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4"
            onClick={() => setShowStockModal(false)}
          >
            <div
              className="w-full max-w-[680px] rounded-[30px] bg-white p-6"
              onClick={(event) => {
                event.stopPropagation()
              }}
            >
              <Text className="text-[26px] font-bold text-[#738296]">Thêm định mức tồn kho</Text>

              <div className="mt-6 space-y-4">
                <Field
                  label="Tồn ít nhất"
                  value={form.minStock}
                  onChange={(value) => setForm((prev) => ({ ...prev, minStock: value }))}
                />
                <Field
                  label="Tồn nhiều nhất"
                  value={form.maxStock}
                  onChange={(value) => setForm((prev) => ({ ...prev, maxStock: value }))}
                />
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  className="rounded-xl border border-[#c8cdd5] bg-white px-4 py-2 text-[18px] font-medium text-[#6f7c8d]"
                  onClick={() => setShowStockModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="rounded-xl border-none bg-[#1777ec] px-4 py-2 text-[18px] font-semibold text-white"
                  onClick={() => setShowStockModal(false)}
                >
                  Xong
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  function renderAttributes() {
    return (
      <div className="inset-top pb-4">
        <header className="flex h-[60px] items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button className="h-9 w-9 border-none bg-transparent text-[#6f7c8d]" onClick={() => setMode('new-item')}>
              <Icon icon="zi-arrow-left" size={22} />
            </button>
            <Text className="text-[26px] font-bold text-[#111827]">Danh sách thuộc tính</Text>
          </div>
          <button className="h-9 w-9 border-none bg-transparent text-[#374151]">
            <Icon icon="zi-plus" size={24} />
          </button>
        </header>

        <div className="rounded-3xl bg-white">
          {ATTRIBUTE_OPTIONS.map((option, index) => {
            const checked = selectedAttributes.includes(option)
            return (
              <button
                key={option}
                className="w-full border-none bg-transparent px-4 py-5 text-left"
                onClick={() => {
                  setSelectedAttributes((prev) =>
                    prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option],
                  )
                }}
              >
                <div className="flex items-center justify-between">
                  <Text className="text-[22px] font-bold text-[#111827]">{option}</Text>
                  <span
                    className={
                      checked
                        ? 'h-10 w-10 rounded-xl border-2 border-[#1677ff] bg-[#eaf3ff]'
                        : 'h-10 w-10 rounded-xl border-2 border-[#9aa5b2] bg-white'
                    }
                  />
                </div>
                {index !== ATTRIBUTE_OPTIONS.length - 1 && <div className="mt-5 h-px bg-[#eceff4]" />}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const content =
    section === 'shipping'
      ? renderShipping()
      : mode === 'list'
        ? renderInventoryList()
        : mode === 'new-item'
          ? renderCreateItem()
          : renderAttributes()

  return (
    <MerchantLayout>
      <Page restoreScroll className="bg-[#eef1f5]">
        <PageContainer withBottomNav noInsetTop>
          {content}
        </PageContainer>
      </Page>
      <MerchantTabs activeTab={activeTab} />
    </MerchantLayout>
  )
}
