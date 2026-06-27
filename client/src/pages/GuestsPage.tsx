import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Trash2, Edit2, Send, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface GuestsPageProps {
  bookingId: string;
}

export default function GuestsPage({ bookingId }: GuestsPageProps) {
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [editingGuest, setEditingGuest] = useState<any>(null);
  const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    guestName: "",
    phoneNumber: "",
    cardsCount: 1,
    notes: "",
  });

  const { data: guests = [], isLoading, refetch } = trpc.guests.getByBooking.useQuery({ bookingId });
  const { data: booking } = trpc.bookings.getById.useQuery({ bookingId });
  const { data: stats } = trpc.bookings.getStats.useQuery({ bookingId });

  const createMutation = trpc.guests.create.useMutation();
  const updateMutation = trpc.guests.update.useMutation();
  const deleteMutation = trpc.guests.delete.useMutation();
  const bulkDeleteMutation = trpc.guests.bulkDelete.useMutation();

  const filteredGuests = useMemo(() => {
    return guests.filter((guest: any) => {
      const matchesSearch =
        guest.guestName.includes(searchTerm) ||
        guest.phoneNumber.includes(searchTerm);
      const matchesStatus = !statusFilter || guest.rsvpStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [guests, searchTerm, statusFilter]);

  const handleAddGuest = async () => {
    if (!formData.guestName || !formData.phoneNumber) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }

    try {
      await createMutation.mutateAsync({
        bookingId,
        ...formData,
      });
      toast.success("تم إضافة الضيف بنجاح");
      setFormData({ guestName: "", phoneNumber: "", cardsCount: 1, notes: "" });
      setIsAddingGuest(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "فشل إضافة الضيف");
    }
  };

  const handleUpdateGuest = async () => {
    if (!editingGuest.guestName || !editingGuest.phoneNumber) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        guestId: editingGuest.id,
        guestName: editingGuest.guestName,
        phoneNumber: editingGuest.phoneNumber,
        cardsCount: editingGuest.cardsCount,
        notes: editingGuest.notes,
      });
      toast.success("تم تحديث الضيف بنجاح");
      setEditingGuest(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "فشل تحديث الضيف");
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    try {
      await deleteMutation.mutateAsync({ guestId });
      toast.success("تم حذف الضيف بنجاح");
      setDeleteConfirm(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "فشل حذف الضيف");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedGuests.size === 0) {
      toast.error("يرجى تحديد الضيوف للحذف");
      return;
    }

    try {
      await bulkDeleteMutation.mutateAsync({
        guestIds: Array.from(selectedGuests),
      });
      toast.success(`تم حذف ${selectedGuests.size} ضيف`);
      setSelectedGuests(new Set());
      setBulkDeleteConfirm(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "فشل حذف الضيوف");
    }
  };

  const toggleGuestSelection = (guestId: string) => {
    const newSelected = new Set(selectedGuests);
    if (newSelected.has(guestId)) {
      newSelected.delete(guestId);
    } else {
      newSelected.add(guestId);
    }
    setSelectedGuests(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedGuests.size === filteredGuests.length) {
      setSelectedGuests(new Set());
    } else {
      setSelectedGuests(new Set(filteredGuests.map((g: any) => g.id)));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: any = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "قيد الانتظار" },
      confirmed: { bg: "bg-green-100", text: "text-green-800", label: "مؤكد" },
      declined: { bg: "bg-red-100", text: "text-red-800", label: "معتذر" },
      sent: { bg: "bg-blue-100", text: "text-blue-800", label: "مرسل" },
      delivered: { bg: "bg-purple-100", text: "text-purple-800", label: "تم التسليم" },
      read: { bg: "bg-indigo-100", text: "text-indigo-800", label: "مقروء" },
      failed: { bg: "bg-gray-100", text: "text-gray-800", label: "فشل" },
    };
    const s = statusMap[status] || statusMap.pending;
    return <span className={`px-2 py-1 rounded text-sm ${s.bg} ${s.text}`}>{s.label}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="جاري تحميل الضيوف..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">قائمة الضيوف</h1>
          <p className="text-gray-600 mt-1 text-lg">{booking?.clientName}</p>
        </div>
        <div className="flex gap-2">
          {selectedGuests.size > 0 && (
            <AlertDialog open={bulkDeleteConfirm} onOpenChange={setBulkDeleteConfirm}>
              <Button variant="destructive" onClick={() => setBulkDeleteConfirm(true)} className="rounded-lg">
                حذف المحدد ({selectedGuests.size})
              </Button>
              <AlertDialogContent className="rounded-[1.625rem]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold">تأكيد الحذف</AlertDialogTitle>
                  <AlertDialogDescription>
                    هل أنت متأكد من حذف {selectedGuests.size} ضيف؟ لا يمكن التراجع عن هذا الإجراء.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex gap-2">
                  <AlertDialogCancel className="rounded-lg">إلغاء</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700 rounded-lg">
                    حذف
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Dialog open={isAddingGuest} onOpenChange={setIsAddingGuest}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-[1.125rem] px-6 py-2 h-auto">
                <Plus className="w-4 h-4" />
                <span className="text-base">إضافة ضيف</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[1.625rem]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">إضافة ضيف جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold">اسم الضيف *</Label>
                  <Input
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    placeholder="اسم الضيف"
                    className="rounded-lg border-gray-200"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold">رقم الهاتف *</Label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="رقم الهاتف"
                    className="rounded-lg border-gray-200"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold">عدد البطاقات</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.cardsCount}
                    onChange={(e) => setFormData({ ...formData, cardsCount: parseInt(e.target.value) || 1 })}
                    className="rounded-lg border-gray-200"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold">ملاحظات</Label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="ملاحظات"
                    className="rounded-lg border-gray-200"
                  />
                </div>
                <Button onClick={handleAddGuest} className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg">
                  إضافة الضيف
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="rounded-[1.625rem] border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{stats.total}</p>
                <p className="text-gray-600 text-sm font-medium">إجمالي الضيوف</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-[1.625rem] border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-gray-600 text-sm font-medium">قيد الانتظار</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-[1.625rem] border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
                <p className="text-gray-600 text-sm font-medium">مؤكد</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-[1.625rem] border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{stats.declined}</p>
                <p className="text-gray-600 text-sm font-medium">معتذر</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="البحث عن الضيف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 rounded-lg border-gray-200 bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 font-medium"
        >
          <option value="">جميع الحالات</option>
          <option value="pending">قيد الانتظار</option>
          <option value="confirmed">مؤكد</option>
          <option value="declined">معتذر</option>
          <option value="sent">مرسل</option>
          <option value="delivered">تم التسليم</option>
          <option value="read">مقروء</option>
          <option value="failed">فشل</option>
        </select>
      </div>

      {/* Guests Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredGuests.length === 0 ? (
        <Card className="border-dashed rounded-[1.625rem] border-gray-200">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">لا توجد ضيوف</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-[1.625rem] border-gray-200 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-right">
                      <Checkbox
                        checked={selectedGuests.size === filteredGuests.length && filteredGuests.length > 0}
                        onCheckedChange={toggleAllSelection}
                      />
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-sm text-gray-700">الاسم</th>
                    <th className="px-4 py-3 text-right font-semibold text-sm text-gray-700">الهاتف</th>
                    <th className="px-4 py-3 text-right font-semibold text-sm text-gray-700">البطاقات</th>
                    <th className="px-4 py-3 text-right font-semibold text-sm text-gray-700">الحالة</th>
                    <th className="px-4 py-3 text-right font-semibold text-sm text-gray-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((guest: any) => (
                    <tr key={guest.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedGuests.has(guest.id)}
                          onCheckedChange={() => toggleGuestSelection(guest.id)}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{guest.guestName}</td>
                      <td className="px-4 py-3 text-gray-600">{guest.phoneNumber}</td>
                      <td className="px-4 py-3 text-gray-600">{guest.cardsCount}</td>
                      <td className="px-4 py-3">{getStatusBadge(guest.rsvpStatus)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Dialog open={editingGuest?.id === guest.id} onOpenChange={(open) => !open && setEditingGuest(null)}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingGuest(guest)}
                                className="rounded-lg border-gray-200 hover:bg-purple-50 hover:text-purple-600"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-[1.625rem]">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">تحديث الضيف</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-semibold">اسم الضيف *</Label>
                                  <Input
                                    value={editingGuest?.guestName || ""}
                                    onChange={(e) => setEditingGuest({ ...editingGuest, guestName: e.target.value })}
                                    className="rounded-lg border-gray-200"
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm font-semibold">رقم الهاتف *</Label>
                                  <Input
                                    value={editingGuest?.phoneNumber || ""}
                                    onChange={(e) => setEditingGuest({ ...editingGuest, phoneNumber: e.target.value })}
                                    className="rounded-lg border-gray-200"
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm font-semibold">عدد البطاقات</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={editingGuest?.cardsCount || 1}
                                    onChange={(e) => setEditingGuest({ ...editingGuest, cardsCount: parseInt(e.target.value) || 1 })}
                                    className="rounded-lg border-gray-200"
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm font-semibold">ملاحظات</Label>
                                  <Input
                                    value={editingGuest?.notes || ""}
                                    onChange={(e) => setEditingGuest({ ...editingGuest, notes: e.target.value })}
                                    className="rounded-lg border-gray-200"
                                  />
                                </div>
                                <Button onClick={handleUpdateGuest} className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg">
                                  تحديث الضيف
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <AlertDialog open={deleteConfirm === guest.id} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setDeleteConfirm(guest.id)}
                              className="rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <AlertDialogContent className="rounded-[1.625rem]">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-bold">تأكيد الحذف</AlertDialogTitle>
                                <AlertDialogDescription>
                                  هل أنت متأكد من حذف {guest.guestName}؟
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="flex gap-2">
                                <AlertDialogCancel className="rounded-lg">إلغاء</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteGuest(guest.id)} className="bg-red-600 hover:bg-red-700 rounded-lg">
                                  حذف
                                </AlertDialogAction>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
