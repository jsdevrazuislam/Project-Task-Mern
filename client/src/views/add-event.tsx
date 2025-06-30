import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Calendar, MapPin, FileText } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createEvent } from "../lib/event"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const schema = yup.object().shape({
    title: yup.string().required("Event title is required"),
    date: yup.string().required("Date is required"),
    time: yup.string().required("Time is required"),
    location: yup.string().required("Location is required"),
    description: yup.string().min(10, "Description at least 10 character required").required(),
})

type FormValues = yup.InferType<typeof schema>

export default function AddEventPage() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
    })

    const { mutate, isPending } = useMutation({
        mutationFn: createEvent,
        onSuccess: () => {
            toast.success("Event created successfully!")
            reset()
            queryClient.invalidateQueries({ queryKey: ['getAllEvents'] })
            navigate('/events')
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    const onSubmit = (data: FormValues) => {
        mutate({
            title: data?.title,
            description: data?.description,
            location: data?.location,
            date: data?.date,
            time: data?.time
        })
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
                    <p className="text-gray-600">Fill in the details to create your event</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2" />
                            Event Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="flex items-center">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Event Title
                                </Label>
                                <Input id="title" placeholder="Enter event title" {...register("title")} error={errors?.title?.message} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 relative">
                                    <Label htmlFor="date" className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Date
                                    </Label>
                                    <Input type="date" id="date"  {...register("date")} error={errors?.date?.message} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="time" className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Time
                                    </Label>
                                    <Input type="time" id="time" {...register("time")} error={errors?.time?.message} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location" className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Location
                                </Label>
                                <Input id="location" placeholder="Enter event location" {...register("location")} error={errors?.location?.message} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" rows={4} placeholder="Describe your event..." {...register("description")} />
                                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                            </div>

                            <Button isLoading={isPending} type="submit" className="w-full" size="lg">
                                Create Event
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
