
import { useState } from "react"
import { Calendar, Check, Clock, MapPin, Plus, Users } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { useAuth } from "../context/auth-context"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllEvents, joinEventApi } from "../lib/event"
import { toast } from "sonner"
import { EventCardSkeleton } from "../components/event-card-skeleton"
import { useNavigate } from "react-router-dom"
import { EventSearchFilters, type DateFilterRange } from "../components/event-filter"
import { useDebounce } from "use-debounce"
import { formatTime12hr } from "../lib/utils"


export default function EventsPage() {
  const [filters, setFilters] = useState<{
    searchQuery: string
    dateRange: { from?: Date; to?: Date }
  }>({
    searchQuery: "",
    dateRange: { from: undefined, to: undefined }
  })
  const navigate = useNavigate()


  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [debouncedSearch] = useDebounce(filters.searchQuery, 400)
  const [debouncedDateRange] = useDebounce(filters.dateRange, 400)
  const { data, isLoading } = useQuery<EventsResponse>({
    queryKey: ['getAllEvents', debouncedSearch, debouncedDateRange],
    queryFn: () =>
      getAllEvents({
        search: debouncedSearch,
        from: debouncedDateRange.from?.toISOString(),
        to: debouncedDateRange.to?.toISOString(),
      }),
    staleTime: 1000 * 60,
  })

  const events = data?.data?.events ?? []

  const { mutate, isPending } = useMutation({
    mutationFn: (eventId: string) => joinEventApi(eventId),
    onSuccess: ({ data }) => {
      queryClient.setQueryData<EventsResponse>(["getAllEvents", debouncedSearch, debouncedDateRange], (old) => {
        if (!old) return old

        return {
          ...old,
          data: {
            ...old.data,
            events: old?.data?.events?.map((event) =>
              event._id === data._id ? data : event
            ),
          }
        }
      })

      toast.success("Successfully Joined!", {
        description: `You have joined "${data?.title}".`,
      })
    },
    onError: (err) => {
      toast.error("Join failed", {
        description: err?.message || "Something went wrong.",
      })
    },
  })




  const joinEvent = (eventId: string) => {
    if (!user) return

    const alreadyJoined = events?.find(
      (e) => e._id === eventId && e?.joinedUsers?.includes(user._id)
    )
    if (alreadyJoined) {
      toast.error("Already Joined", {
        description: "You have already joined this event.",
      })
      return
    }

    mutate(eventId)
  }

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }))
  }

  const handleFilter = (dateRange: DateFilterRange) => {
    setFilters(prev => ({ ...prev, dateRange }))
  }


  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Events</h1>
          <p className="text-gray-600">Find and join amazing events in your community</p>
        </div>

        <EventSearchFilters
          onSearch={handleSearch}
          onFilter={handleFilter}
        />

        <div className="space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <EventCardSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          )}

          {!isLoading && events?.length === 0 && (
            <div className="text-center py-12 border rounded-lg bg-muted/50">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {filters.searchQuery || filters.dateRange.to || filters?.dateRange?.from
                  ? "No matching events found"
                  : "No events available yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {filters.searchQuery || filters.dateRange.to || filters?.dateRange?.from
                  ? "Try adjusting your search or filter criteria."
                  : "Be the first to create an event!"}
              </p>
              {!filters.searchQuery && filters.dateRange.to && (
                <Button onClick={() => navigate('/events/new')}>
                  Create New Event
                </Button>
              )}
            </div>
          )}

          {/* Events Grid */}
          {!isLoading && events && events.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event._id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-1">
                      {event.title}
                    </CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">by {event?.createdBy?.name}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <Clock className="h-4 w-4 ml-4 mr-2" />
                      <span>{formatTime12hr(event.time)}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>

                    <p className="text-sm text-foreground line-clamp-3">
                      {event.description}
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <div className="flex items-center justify-between w-full">
                      <Badge variant="secondary" className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {event.attendeeCount} {event.attendeeCount === 1 ? 'attendee' : 'attendees'}
                      </Badge>

                      <Button
                        onClick={() => joinEvent(event._id)}
                        disabled={event.joinedUsers?.includes(user?._id || '')}
                        isLoading={isPending}
                        size="sm"
                        variant={event.joinedUsers?.includes(user?._id || '') ? 'default' : 'outline'}
                      >
                        {event.joinedUsers?.includes(user?._id || '') ? (
                          <Check className="h-4 w-4 mr-1" />
                        ) : (
                          <Plus className="h-4 w-4 mr-1" />
                        )}
                        {event.joinedUsers?.includes(user?._id || '') ? 'Joined' : 'Join'}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
