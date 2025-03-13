
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock, Mail, Ticket, Calendar as CalendarIcon2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type DeliveryConfig = {
  type: 'manual' | 'scheduled' | 'triggered';
  emailAddresses: string[];
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    dayOfMonth?: number;
    dayOfWeek?: number;
    time?: string;
    startDate?: Date;
  };
  trigger?: {
    type: 'ticket-closed' | 'purchase-completed';
    delayHours: number;
  };
};

interface EmailDeliverySettingsProps {
  deliveryConfig: DeliveryConfig;
  onConfigChange: (config: DeliveryConfig) => void;
}

export default function EmailDeliverySettings({ deliveryConfig, onConfigChange }: EmailDeliverySettingsProps) {
  const [emailInput, setEmailInput] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(deliveryConfig.schedule?.startDate);

  const handleDeliveryTypeChange = (value: 'manual' | 'scheduled' | 'triggered') => {
    onConfigChange({
      ...deliveryConfig,
      type: value,
    });
  };

  const handleFrequencyChange = (value: 'daily' | 'weekly' | 'monthly') => {
    onConfigChange({
      ...deliveryConfig,
      schedule: {
        ...deliveryConfig.schedule,
        frequency: value,
      },
    });
  };

  const handleTriggerTypeChange = (value: 'ticket-closed' | 'purchase-completed') => {
    onConfigChange({
      ...deliveryConfig,
      trigger: {
        ...deliveryConfig.trigger,
        type: value,
      },
    });
  };

  const handleDelayHoursChange = (value: string) => {
    onConfigChange({
      ...deliveryConfig,
      trigger: {
        ...deliveryConfig.trigger,
        delayHours: parseInt(value) || 0,
      },
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      onConfigChange({
        ...deliveryConfig,
        schedule: {
          ...deliveryConfig.schedule,
          startDate: date,
        },
      });
    }
  };

  const handleTimeChange = (value: string) => {
    onConfigChange({
      ...deliveryConfig,
      schedule: {
        ...deliveryConfig.schedule,
        time: value,
      },
    });
  };

  const handleDayChange = (value: string) => {
    const day = parseInt(value);
    if (deliveryConfig.schedule?.frequency === 'monthly') {
      onConfigChange({
        ...deliveryConfig,
        schedule: {
          ...deliveryConfig.schedule,
          dayOfMonth: day,
        },
      });
    } else if (deliveryConfig.schedule?.frequency === 'weekly') {
      onConfigChange({
        ...deliveryConfig,
        schedule: {
          ...deliveryConfig.schedule,
          dayOfWeek: day,
        },
      });
    }
  };

  const addEmail = () => {
    if (emailInput && !deliveryConfig.emailAddresses.includes(emailInput)) {
      onConfigChange({
        ...deliveryConfig,
        emailAddresses: [...deliveryConfig.emailAddresses, emailInput],
      });
      setEmailInput('');
    }
  };

  const removeEmail = (email: string) => {
    onConfigChange({
      ...deliveryConfig,
      emailAddresses: deliveryConfig.emailAddresses.filter(e => e !== email),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Delivery Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Delivery Method</h3>
          <RadioGroup
            value={deliveryConfig.type}
            onValueChange={(value) => handleDeliveryTypeChange(value as 'manual' | 'scheduled' | 'triggered')}
            className="space-y-3"
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="manual" id="manual" />
              <div className="grid gap-1.5">
                <Label htmlFor="manual" className="font-medium">Manual Sending</Label>
                <p className="text-sm text-muted-foreground">
                  Send surveys manually when needed
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="scheduled" id="scheduled" />
              <div className="grid gap-1.5">
                <Label htmlFor="scheduled" className="font-medium">Scheduled</Label>
                <p className="text-sm text-muted-foreground">
                  Send surveys on a regular schedule (daily, weekly, monthly)
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="triggered" id="triggered" />
              <div className="grid gap-1.5">
                <Label htmlFor="triggered" className="font-medium">Event Triggered</Label>
                <p className="text-sm text-muted-foreground">
                  Send surveys when specific events occur (ticket closed, purchase completed)
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Recipient Emails</h3>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Add email address"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addEmail} type="button">Add</Button>
          </div>
          
          {deliveryConfig.emailAddresses.length > 0 ? (
            <div className="space-y-2">
              {deliveryConfig.emailAddresses.map((email, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                  <span className="text-sm">{email}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeEmail(email)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recipients added yet</p>
          )}
        </div>
        
        {deliveryConfig.type === 'scheduled' && (
          <>
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Schedule Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={deliveryConfig.schedule?.frequency || 'monthly'}
                    onValueChange={(value) => handleFrequencyChange(value as 'daily' | 'weekly' | 'monthly')}
                  >
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {deliveryConfig.schedule?.frequency === 'weekly' && (
                  <div>
                    <Label htmlFor="day-of-week">Day of Week</Label>
                    <Select
                      value={deliveryConfig.schedule?.dayOfWeek?.toString() || '1'}
                      onValueChange={handleDayChange}
                    >
                      <SelectTrigger id="day-of-week">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Monday</SelectItem>
                        <SelectItem value="2">Tuesday</SelectItem>
                        <SelectItem value="3">Wednesday</SelectItem>
                        <SelectItem value="4">Thursday</SelectItem>
                        <SelectItem value="5">Friday</SelectItem>
                        <SelectItem value="6">Saturday</SelectItem>
                        <SelectItem value="0">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {deliveryConfig.schedule?.frequency === 'monthly' && (
                  <div>
                    <Label htmlFor="day-of-month">Day of Month</Label>
                    <Select
                      value={deliveryConfig.schedule?.dayOfMonth?.toString() || '1'}
                      onValueChange={handleDayChange}
                    >
                      <SelectTrigger id="day-of-month">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="time">Time of Day</Label>
                  <Input
                    id="time"
                    type="time"
                    value={deliveryConfig.schedule?.time || '09:00'}
                    onChange={(e) => handleTimeChange(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </>
        )}
        
        {deliveryConfig.type === 'triggered' && (
          <>
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Trigger Configuration</h3>
              
              <div>
                <Label htmlFor="trigger-type">Trigger Event</Label>
                <Select
                  value={deliveryConfig.trigger?.type || 'ticket-closed'}
                  onValueChange={(value) => handleTriggerTypeChange(value as 'ticket-closed' | 'purchase-completed')}
                >
                  <SelectTrigger id="trigger-type">
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ticket-closed">Ticket Closed</SelectItem>
                    <SelectItem value="purchase-completed">Purchase Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="delay">Delay (hours)</Label>
                <Input
                  id="delay"
                  type="number"
                  min="0"
                  value={deliveryConfig.trigger?.delayHours.toString() || '24'}
                  onChange={(e) => handleDelayHoursChange(e.target.value)}
                  placeholder="24"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Time to wait after the trigger event before sending the survey
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
