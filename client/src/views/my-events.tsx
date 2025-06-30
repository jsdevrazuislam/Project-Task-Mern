

import { useState } from "react"
import { Calendar, MapPin, Users, Edit, Trash2, Clock } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import { useAuth } from "../context/auth-context"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteEvent, getAllMyEvents, updateEvent } from "../lib/event"
import { EventCardSkeleton } from "../components/event-card-skeleton"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { formatTime12hr } from "../lib/utils"


export default function MyEventsPage() {
    const [editingEvent, setEditingEvent] = useState<EventsEntity | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { data, isLoading } = useQuery<EventsResponse>({
        queryKey: ['getAllEvents'],
        queryFn: () => getAllMyEvents({}),
    })

    const events = data?.data?.events ?? []

    const { mutate, isPending } = useMutation({
        mutationFn: updateEvent,
        onSuccess: ({ data }) => {
            queryClient.setQueryData<EventsResponse>(["getAllEvents"], (old) => {
                if (!old) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        events: old?.data?.events?.map((event) =>
                            event._id === data._id ? data : event
                        ),
                    },
                };
            });

            setIsEditDialogOpen(false);
            toast.success("Event updated successfully!");
        },
        onError: () => {
            toast.error("Failed to update event");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteEvent,
        onSuccess: (_, eventId) => {
            queryClient.setQueryData<EventsResponse>(["getAllEvents"], (old) => {
                if (!old) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        events: old?.data?.events?.filter((event) => event._id !== eventId),
                    },
                };
            });

            toast.success("Event deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete event");
        },
    });



    const handleEdit = (event: EventsEntity) => {
        setEditingEvent(event)
        setIsEditDialogOpen(true)
    }

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEvent) return;

        mutate({
            id: editingEvent._id,
            title: editingEvent.title,
            description: editingEvent.description,
            location: editingEvent.location,
            date: editingEvent.date,
            time: editingEvent.time,
        });
    };


    const handleDelete = (eventId: string) => {
        deleteMutation.mutate(eventId);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editingEvent) return

        setEditingEvent({
            ...editingEvent,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
                <p className="text-gray-600">Manage your created events</p>
            </div>


            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <EventCardSkeleton key={`skeleton-${index}`} />
                    ))}
                </div>
            )}
            {!isLoading && events?.length === 0 && (
                <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events created yet</h3>
                    <p className="text-gray-500 mb-4">Start by creating your first event!</p>
                    <Button onClick={() => navigate('/add-event')}>Create Event</Button>
                </div>
            )}

            {
                !isLoading && events && events.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <Card key={event._id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-xl">{event.title}</CardTitle>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Users className="h-4 w-4 mr-1" />
                                    <span>by {user?.name}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                    <Clock className="h-4 w-4 ml-4 mr-2" />
                                    <span>{formatTime12hr(event.time)}</span>
                                </div>

                                <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    <span>{event.location}</span>
                                </div>

                                <p className="text-gray-700 text-sm line-clamp-3">{event.description}</p>

                                <div className="flex items-center justify-between">
                                    <Badge variant="secondary" className="flex items-center">
                                        <Users className="h-3 w-3 mr-1" />
                                        {event.attendeeCount} attendees
                                    </Badge>
                                </div>

                                <div className="flex space-x-2">
                                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 bg-transparent"
                                                onClick={() => handleEdit(event)}
                                                isLoading={isPending || deleteMutation.isPending}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Update
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Update Event</DialogTitle>
                                            </DialogHeader>
                                            {editingEvent && (
                                                <form onSubmit={handleUpdate} className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="edit-title">Event Title</Label>
                                                        <Input
                                                            id="edit-title"
                                                            name="title"
                                                            value={editingEvent.title}
                                                            onChange={handleEditChange}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-date">Date</Label>
                                                            <Input
                                                                id="edit-date"
                                                                name="date"
                                                                type="date"
                                                                value={editingEvent.date}
                                                                onChange={handleEditChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-time">Time</Label>
                                                            <Input
                                                                id="edit-time"
                                                                name="time"
                                                                type="time"
                                                                value={editingEvent.time}
                                                                onChange={handleEditChange}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="edit-location">Location</Label>
                                                        <Input
                                                            id="edit-location"
                                                            name="location"
                                                            value={editingEvent.location}
                                                            onChange={handleEditChange}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="edit-description">Description</Label>
                                                        <Textarea
                                                            id="edit-description"
                                                            name="description"
                                                            value={editingEvent.description}
                                                            onChange={handleEditChange}
                                                            rows={3}
                                                            required
                                                        />
                                                    </div>

                                                    <Button type="submit" className="w-full">
                                                        Update Event
                                                    </Button>
                                                </form>
                                            )}
                                        </DialogContent>
                                    </Dialog>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button isLoading={isPending || deleteMutation.isPending} variant="destructive" size="sm" className="flex-1 text-white">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your event "{event.title}" and
                                                    remove all associated data.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(event._id)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            }
        </div>
    )
}
