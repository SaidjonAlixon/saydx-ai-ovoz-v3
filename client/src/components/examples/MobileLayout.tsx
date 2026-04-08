import MobileLayout from '../MobileLayout'

export default function MobileLayoutExample() {
  return (
    <MobileLayout>
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Bosh sahifa</h1>
        <p>Bu yerda asosiy kontent bo'ladi...</p>
        <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
          Kontent maydoni
        </div>
      </div>
    </MobileLayout>
  )
}