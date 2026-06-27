import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function GuestsListPage() {
  const [, setLocation] = useLocation();
  const { data: bookings = [], isLoading } = trpc.bookings.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-center mb-6">إدارة الضيوف</h1>
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">لا توجد حجوزات. أنشئ حجزاً أولاً لإدارة الضيوف.</p>
            <Button onClick={() => setLocation("/bookings")}>
              الذهاب للحجوزات
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-2">إدارة الضيوف</h1>
      <p className="text-center text-muted-foreground mb-6">اختر الحجز لإدارة قائمة الضيوف</p>
      <div className="grid gap-4 max-w-2xl mx-auto">
        {bookings.map((booking: any) => (
          <Card
            key={booking.id}
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setLocation(`/bookings/${booking.id}/guests`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{booking.clientName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {booking.eventType || "حفل"} -{" "}
                      {booking.eventDate
                        ? new Date(booking.eventDate).toLocaleDateString("ar-OM")
                        : ""}
                    </p>
                    {booking.venueName && (
                      <p className="text-xs text-muted-foreground">{booking.venueName}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Users className="h-4 w-4" />
                    إدارة الضيوف
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation(`/bookings/${booking.id}/send`);
                    }}
                  >
                    <Send className="h-3 w-3" />
                    إرسال الدعوات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
