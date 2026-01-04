'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, User, Stethoscope, Calendar, Phone, Mail, MapPin, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

export interface Appointment {
  id: string;
  patient_name: string;
  patient_email?: string;
  patient_phone?: string;
  doctor_name: string;
  doctor_specialty?: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  location?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: Appointment['status']) => void;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  userRole?: 'patient' | 'doctor' | 'admin';
}

export default function AppointmentCard({
  appointment,
  onEdit,
  onDelete,
  onStatusChange,
  variant = 'default',
  showActions = true,
  userRole = 'patient'
}: AppointmentCardProps) {
  const getStatusVariant = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const canEdit = userRole === 'admin' || userRole === 'doctor';
  const canDelete = userRole === 'admin';
  const canChangeStatus = userRole === 'admin' || userRole === 'doctor';

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium">
                  {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                </span>
              </div>
              <Badge className={getStatusVariant(appointment.status)}>
                {appointment.status}
              </Badge>
            </div>
            <div className="text-right">
              <p className="font-medium text-sm">{appointment.patient_name}</p>
              <p className="text-xs text-gray-600">Dr. {appointment.doctor_name}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(appointment.patient_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{appointment.patient_name}</CardTitle>
                <CardDescription>
                  <div className="flex items-center space-x-2 mt-1">
                    <Mail className="h-3 w-3" />
                    <span className="text-sm">{appointment.patient_email}</span>
                  </div>
                </CardDescription>
              </div>
            </div>
            <Badge className={getStatusVariant(appointment.status)}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{formatDate(appointment.appointment_date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                </span>
              </div>
              {appointment.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{appointment.location}</span>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Dr. {appointment.doctor_name}</span>
              </div>
              {appointment.doctor_specialty && (
                <div className="text-sm text-gray-600 ml-6">
                  {appointment.doctor_specialty}
                </div>
              )}
              {appointment.patient_phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{appointment.patient_phone}</span>
                </div>
              )}
            </div>
          </div>
          
          {appointment.notes && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Notes:</span> {appointment.notes}
              </p>
            </div>
          )}

          {showActions && (canEdit || canDelete || canChangeStatus) && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex space-x-2">
                {canChangeStatus && appointment.status === 'scheduled' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStatusChange?.(appointment.id, 'completed')}
                    className="text-green-600 hover:text-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Complete
                  </Button>
                )}
                {canChangeStatus && appointment.status === 'scheduled' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStatusChange?.(appointment.id, 'cancelled')}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                {canEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(appointment)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
                {canDelete && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(appointment.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getInitials(appointment.patient_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{appointment.patient_name}</CardTitle>
              <CardDescription className="text-sm">
                Dr. {appointment.doctor_name}
                {appointment.doctor_specialty && ` • ${appointment.doctor_specialty}`}
              </CardDescription>
            </div>
          </div>
          <Badge className={getStatusVariant(appointment.status)}>
            {appointment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {new Date(appointment.appointment_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {formatTime(appointment.start_time)}
              </span>
            </div>
          </div>
          
          {showActions && (canEdit || canDelete) && (
            <div className="flex space-x-1">
              {canEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(appointment)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {canDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(appointment.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
