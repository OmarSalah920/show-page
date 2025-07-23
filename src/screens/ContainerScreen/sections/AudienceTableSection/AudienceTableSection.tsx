import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Play, Pause, MoreHorizontal, Upload, Download, Users, Phone } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  lastContact: string;
}

const mockContacts: Contact[] = [
  { id: '1', name: 'John Doe', phone: '+1 (555) 123-4567', email: 'john@example.com', status: 'active', lastContact: '2024-01-15' },
  { id: '2', name: 'Jane Smith', phone: '+1 (555) 987-6543', email: 'jane@example.com', status: 'pending', lastContact: '2024-01-14' },
  { id: '3', name: 'Bob Johnson', phone: '+1 (555) 456-7890', email: 'bob@example.com', status: 'inactive', lastContact: '2024-01-13' },
  { id: '4', name: 'Alice Brown', phone: '+1 (555) 321-0987', email: 'alice@example.com', status: 'active', lastContact: '2024-01-12' },
  { id: '5', name: 'Charlie Wilson', phone: '+1 (555) 654-3210', email: 'charlie@example.com', status: 'pending', lastContact: '2024-01-11' },
];

export function AudienceTableSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importStep, setImportStep] = useState<'select' | 'phonebook' | 'upload'>('select');
  const [listName, setListName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPhonebook, setSelectedPhonebook] = useState('');

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(mockContacts.map(contact => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleSelectContact = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts([...selectedContacts, contactId]);
    } else {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleImport = () => {
    if (importStep === 'upload' && listName && selectedFile) {
      console.log('Importing file:', selectedFile.name, 'as list:', listName);
      // Handle file import logic here
      setIsImportModalOpen(false);
      resetImportModal();
    } else if (importStep === 'phonebook' && selectedPhonebook) {
      console.log('Importing from phonebook:', selectedPhonebook);
      // Handle phonebook import logic here
      setIsImportModalOpen(false);
      resetImportModal();
    }
  };

  const resetImportModal = () => {
    setImportStep('select');
    setListName('');
    setSelectedFile(null);
    setSelectedPhonebook('');
  };

  const downloadSampleFile = () => {
    const link = document.createElement('a');
    link.href = '/Contacts Sample.csv';
    link.download = 'Contacts Sample.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const isImportDisabled = () => {
    if (importStep === 'upload') {
      return !listName || !selectedFile;
    } else if (importStep === 'phonebook') {
      return !selectedPhonebook;
    }
    return true;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">Audience</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlayPause}
            className="flex items-center gap-2"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Run'}
          </Button>
          
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              disabled={isPlaying}
              className="flex items-center gap-2"
            >
              Edit Campaign
            </Button>
            {isPlaying && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                The campaign has to be paused to be able to edit it
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            )}
          </div>

          <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {importStep === 'select' && 'Import Contacts'}
                  {importStep === 'phonebook' && 'Import from Phonebook'}
                  {importStep === 'upload' && 'Upload File'}
                </DialogTitle>
              </DialogHeader>
              
              {importStep === 'select' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center gap-2"
                      onClick={() => setImportStep('phonebook')}
                    >
                      <Phone className="h-6 w-6" />
                      <span>From Phonebook</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center gap-2"
                      onClick={() => setImportStep('upload')}
                    >
                      <Upload className="h-6 w-6" />
                      <span>Upload File</span>
                    </Button>
                  </div>
                </div>
              )}

              {importStep === 'phonebook' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Phonebook</label>
                    <Select value={selectedPhonebook} onValueChange={setSelectedPhonebook}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a phonebook" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal Contacts</SelectItem>
                        <SelectItem value="business">Business Contacts</SelectItem>
                        <SelectItem value="leads">Sales Leads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setImportStep('select')}>
                      Back
                    </Button>
                    <Button onClick={handleImport} disabled={isImportDisabled()}>
                      Import
                    </Button>
                  </div>
                </div>
              )}

              {importStep === 'upload' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">List Name *</label>
                    <input
                      type="text"
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                      placeholder="Enter list name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Upload File</label>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                      onDrop={handleFileDrop}
                      onDragOver={handleDragOver}
                    >
                      {selectedFile ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{selectedFile.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedFile(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            Drag and drop your file here, or{' '}
                            <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
                              browse
                              <input
                                type="file"
                                className="hidden"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileUpload}
                              />
                            </label>
                          </p>
                          <p className="text-xs text-gray-500">CSV, Excel files supported</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Sample File</h4>
                    <p className="text-xs text-gray-600 mb-2">
                      Download our sample file to see the expected format
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadSampleFile}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Sample
                    </Button>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setImportStep('select')}>
                      Back
                    </Button>
                    <Button onClick={handleImport} disabled={isImportDisabled()}>
                      Import
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export Selected</DropdownMenuItem>
              <DropdownMenuItem>Delete Selected</DropdownMenuItem>
              <DropdownMenuItem>Bulk Edit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedContacts.length === mockContacts.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={(checked) => handleSelectContact(contact.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{contact.name}</span>
                  </TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </TableCell>
                  <TableCell>{contact.lastContact}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{selectedContacts.length} of {mockContacts.length} selected</span>
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}