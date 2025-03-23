'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle2, Edit, Save } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Profile() {
  const [userData, setUserData] = useState({
    name: "Admin User",
    email: "dmtosarvesh@gmail.com",
    additional_info: {
      name: "Admin",
      formId: 1,
      address: "this is my address",
      category: "",
      position: "Administrator",
      formTitle: "FORM XIV - APPLICATION FOR REGISTRATION OF COPYRIGHT [SEE RULE 70]",
      department: "Legal",
      work_class: "",
      work_title: "",
      author_name: "",
      declaration: "",
      nationality: "India",
      work_sample: "",
      work_language: "",
      author_address: "",
      publication_year: "",
      work_description: "",
      publisher_details: "",
      publication_status: "",
      fee_payment_details: ""
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // null, 'success', 'error'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUserData({
        ...userData,
        [parent]: {
          ...(userData[parent as keyof typeof userData] as Record<string, any>),
          [child]: value
        }
      });
    } else {
      setUserData({
        ...userData,
        [name]: value
      });
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUserData({
        ...userData,
        [parent]: {
          ...userData[parent],
          [child]: value
        }
      });
    } else {
      setUserData({
        ...userData,
        [name]: value
      });
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      const response = await fetch(`https://57a3-2401-4900-60d7-93d7-e1cb-944d-4a73-713e.ngrok-free.app/ml/users/1/update-attributes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRtdG9zYXJ2ZXNoQGdtYWlsLmNvbSIsImlkIjoxLCJicm93c2VyIjoiUG9zdG1hblJ1bnRpbWUvNy40My4wIiwidmVyc2lvbiI6MywiaWF0IjoxNzQyNzI5MzQ3LCJleHAiOjE3NDI5ODg1NDd9.N6KpKRcFj2Z11gjliuqNlKeW5MifUe1Ln9sFzk4n2v8'
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user data');
      }
      
      setSaveStatus('success');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    }
  };

  return (
    <div className='w-full min-h-screen bg-foreground text-background p-6 mt-20 font-inter'>
      <div className='max-w-5xl mx-auto'>
        {saveStatus === 'success' && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">
              Your form has been updated successfully.
            </AlertDescription>
          </Alert>
        )}
        
        {saveStatus === 'error' && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-800">Error</AlertTitle>
            <AlertDescription className="text-red-700">
              There was a problem updating your form. Please try again.
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="mb-6 shadow-sm rounded-none">
          <CardHeader className="bg-foreground border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold text-background">User Profile</CardTitle>
                <CardDescription className="text-slate-500">Your account information</CardDescription>
              </div>
              <Button 
                variant={isEditing ? "secondary" : "default"} 
                onClick={() => setIsEditing(!isEditing)}
                disabled={isSaving}
              >
                {isEditing ? "Cancel" : <><Edit className="h-4 w-4 mr-2 text-foreground" /> <p className='text-foreground'>Edit</p></>}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={userData.name} 
                  onChange={handleChange} 
                  name="name" 
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  value={userData.email} 
                  onChange={handleChange} 
                  name="email" 
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input 
                  id="position" 
                  value={userData.additional_info.position} 
                  onChange={handleChange} 
                  name="additional_info.position" 
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input 
                  id="department" 
                  value={userData.additional_info.department} 
                  onChange={handleChange} 
                  name="additional_info.department" 
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm rounded-none">
          <CardHeader className="bg-foreground border-b">
            <CardTitle className="text-2xl font-bold bg-foreground">
              Additional Information
            </CardTitle>

          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input 
                      id="nationality" 
                      value={userData.additional_info.nationality} 
                      onChange={handleChange} 
                      name="additional_info.nationality" 
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea 
                      id="address" 
                      value={userData.additional_info.address} 
                      onChange={handleChange} 
                      name="additional_info.address" 
                      disabled={!isEditing}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Work Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="work_class">Work Class</Label>
                    <Select 
                      disabled={!isEditing}
                      value={userData.additional_info.work_class}
                      onValueChange={(value) => handleSelectChange(value, 'additional_info.work_class')}
                    >
                      <SelectTrigger id="work_class" className="mt-1">
                        <SelectValue placeholder="Select work class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="literary">Literary</SelectItem>
                        <SelectItem value="artistic">Artistic</SelectItem>
                        <SelectItem value="musical">Musical</SelectItem>
                        <SelectItem value="dramatic">Dramatic</SelectItem>
                        <SelectItem value="cinematograph">Cinematograph Film</SelectItem>
                        <SelectItem value="sound_recording">Sound Recording</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="work_title">Work Title</Label>
                    <Input 
                      id="work_title" 
                      value={userData.additional_info.work_title} 
                      onChange={handleChange} 
                      name="additional_info.work_title" 
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="work_language">Work Language</Label>
                    <Input 
                      id="work_language" 
                      value={userData.additional_info.work_language} 
                      onChange={handleChange} 
                      name="additional_info.work_language" 
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="work_description">Work Description</Label>
                    <Textarea 
                      id="work_description" 
                      value={userData.additional_info.work_description} 
                      onChange={handleChange} 
                      name="additional_info.work_description" 
                      disabled={!isEditing}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Author Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="author_name">Author Name</Label>
                    <Input 
                      id="author_name" 
                      value={userData.additional_info.author_name} 
                      onChange={handleChange} 
                      name="additional_info.author_name" 
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="author_address">Author Address</Label>
                    <Textarea 
                      id="author_address" 
                      value={userData.additional_info.author_address} 
                      onChange={handleChange} 
                      name="additional_info.author_address" 
                      disabled={!isEditing}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Publication Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="publication_status">Publication Status</Label>
                    <Select 
                      disabled={!isEditing}
                      value={userData.additional_info.publication_status}
                      onValueChange={(value) => handleSelectChange(value, 'additional_info.publication_status')}
                    >
                      <SelectTrigger id="publication_status" className="mt-1">
                        <SelectValue placeholder="Select publication status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="unpublished">Unpublished</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="publication_year">Publication Year</Label>
                    <Input 
                      id="publication_year" 
                      value={userData.additional_info.publication_year} 
                      onChange={handleChange} 
                      name="additional_info.publication_year" 
                      disabled={!isEditing}
                      className="mt-1"
                      type="number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="publisher_details">Publisher Details</Label>
                    <Textarea 
                      id="publisher_details" 
                      value={userData.additional_info.publisher_details} 
                      onChange={handleChange} 
                      name="additional_info.publisher_details" 
                      disabled={!isEditing}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <Label htmlFor="fee_payment_details">Fee Payment Details</Label>
                    <Textarea 
                      id="fee_payment_details" 
                      value={userData.additional_info.fee_payment_details} 
                      onChange={handleChange} 
                      name="additional_info.fee_payment_details" 
                      disabled={!isEditing}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Declaration</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <Label htmlFor="declaration">Declaration</Label>
                    <Textarea 
                      id="declaration" 
                      value={userData.additional_info.declaration} 
                      onChange={handleChange} 
                      name="additional_info.declaration" 
                      disabled={!isEditing}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t p-6 bg-foreground">
            {isEditing && (
              <Button 
                className="gap-2"
                onClick={handleSubmit} 
                disabled={isSaving}
              >
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 text-foreground" />
                    <p className='text-foreground'>Save Changes</p>
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}