import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar, MapPin, Users, Edit2, Trash2, Send, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function BookingsPage() {
  const [, setLocation] = useLocation();
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    eventDate: "",
    eventType: "wedding",
    venueName: "",
    locationLink: "",
    receptionTime: "",
    hostOne: "",
    hostTwo: "",
    brideName: "",
    groomName: "",
    notes: "",
  });

  const { data: bookings = [], isLoading, refetch } = trpc.bookings.list.useQuery();
  const createMutation = trpc.bookings.create.useMutation();

  const handleCreateBooking = async () => {
    if (!formData.clientName || !formData.clientPhone || !formData.eventDate) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }

    try {
      await createMutation.mutateAsync({
        ...formData,
        eventDate: new Date(formData.eventDate),
      });
      toast.success("تم إنشاء الحجز بنجاح");
      setFormData({
        clientName: "",
        clientPhone: "",
        eventDate: "",
        eventType: "wedding",
        venueName: "",
        locationLink: "",
        receptionTime: "",
        hostOne: "",
        hostTwo: "",
        brideName: "",
        groomName: "",
        notes: "",
      });
      setIsCreating(false);
      refetch();
    } catch (error) {
      toast.error("فشل إنشاء الحجز");
    }
  };

  const handleGoToGuests = (bookingId: string) => {
    setLocation(`/bookings/${bookingId}/guests`);
  };

  const handleGoToSend = (bookingId: string) => {
    setLocation(`/bookings/${bookingId}/send`);
  };

  const filteredBookings = (bookings || []).filter((booking: any) =>
    booking.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.clientPhone.includes(searchQuery)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="جاري تحميل الحجوزات..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Title and Create Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">الحجوزات</h1>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-[1.125rem] px-6 py-2 h-auto">
              <Plus className="h-5 w-5" />
              <span className="text-base">حجز جديد</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[1.625rem]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">إنشاء حجز جديد</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold">اسم العميل *</Label>
                <Input
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="اسم العميل"
                  className="rounded-lg border-gray-200"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">رقم الهاتف *</Label>
                <Input
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  placeholder="+968..."
                  className="rounded-lg border-gray-200"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">تاريخ الحفل *</Label>
                <Input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="rounded-lg border-gray-200"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">نوع الحفل</Label>
                <Input
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  placeholder="زفاف، خطوبة، إلخ"
                  className="rounded-lg border-gray-200"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">اسم المكان</Label>
                <Input
                  value={formData.venueName}
                  onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                  placeholder="اسم المكان"
                  className="rounded-lg border-gray-200"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">وقت الاستقبال</Label>
                <Input
                  type="time"
                  value={formData.receptionTime}
                  onChange={(e) => setFormData({ ...formData, receptionTime: e.target.value })}
                  className="rounded-lg border-gray-200"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">المضيف الأول</Label>
                <Input
                  value={formData.hostOne}
                  onChange={(e) => setFormData({ ...formData, hostOne: e.target.value })}
                  placeholder="اسم المضيف"
                  className="rounded-lg border-gray-200"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">المضيف الثاني</Label>
                <Input
                  value={formData.hostTwo}
                  onChange={(e) => setFormData({ ...formData, hostTwo: e.target.value })}
                  placeholder="اسم المضيف"
                  className="rounded-lg border-gray-200"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">اسم العروس</Label>
                <Input
                  value={formData.brideName}
                  onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                  placeholder="اسم العروس"
                  className="rounded-lg border-gray-200"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold">اسم العريس</Label>
                <Input
                  value={formData.groomName}
                  onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                  placeholder="اسم العريس"
                  className="rounded-lg border-gray-200"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-sm font-semibold">رابط الموقع</Label>
                <Input
                  value={formData.locationLink}
                  onChange={(e) => setFormData({ ...formData, locationLink: e.target.value })}
                  placeholder="https://..."
                  className="rounded-lg border-gray-200"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-sm font-semibold">ملاحظات</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="ملاحظات إضافية"
                  rows={3}
                  className="rounded-lg border-gray-200"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsCreating(false)} className="rounded-lg">
                إلغاء
              </Button>
              <Button 
                onClick={handleCreateBooking} 
                disabled={createMutation.isPending}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg"
              >
                {createMutation.isPending ? "جاري الإنشاء..." : "إنشاء"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          placeholder="ابحث عن حجز..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10 rounded-lg border-gray-200 bg-white"
        />
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card className="text-center py-12 rounded-[1.625rem] border-gray-200">
          <CardContent>
            <p className="text-muted-foreground mb-4">لا توجد حجوزات حتى الآن</p>
            <Button 
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              إنشاء حجز جديد
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-[1.625rem] border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-xl font-bold">قائمة الحجوزات ({filteredBookings.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableHead className="text-right text-sm font-semibold text-gray-700">اسم العميل</TableHead>
                    <TableHead className="text-right text-sm font-semibold text-gray-700">تاريخ الحفل</TableHead>
                    <TableHead className="text-right text-sm font-semibold text-gray-700">نوع الحفل</TableHead>
                    <TableHead className="text-right text-sm font-semibold text-gray-700">المكان</TableHead>
                    <TableHead className="text-right text-sm font-semibold text-gray-700">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking: any) => (
                    <TableRow key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium text-gray-900">{booking.clientName}</TableCell>
                      <TableCell className="text-gray-600">{format(new Date(booking.eventDate), "dd/MM/yyyy")}</TableCell>
                      <TableCell className="text-gray-600">{booking.eventType || "-"}</TableCell>
                      <TableCell className="text-gray-600">{booking.venueName || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGoToGuests(booking.id)}
                            className="gap-1 rounded-lg border-gray-200 hover:bg-purple-50 hover:text-purple-600"
                          >
                            <Users className="h-4 w-4" />
                            الضيوف
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGoToSend(booking.id)}
                            className="gap-1 rounded-lg border-gray-200 hover:bg-purple-50 hover:text-purple-600"
                          >
                            <Send className="h-4 w-4" />
                            إرسال
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
