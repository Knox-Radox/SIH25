import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    Upload,
    FileText,
    File,
    Image,
    FileSpreadsheet,
    X,
    CheckCircle2,
    AlertCircle,
    Clock,
    Download,
    Eye
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const FileUpload = ({ onUpload, maxSize = 10485760, multiple = true }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    // Enhanced file type support based on roadmap
    const acceptedTypes = {
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'message/rfc822': ['.eml'],
        'application/vnd.ms-outlook': ['.msg'],
        'text/csv': ['.csv'],
        'application/xml': ['.xml'],
        'text/xml': ['.xml'],
        'image/png': ['.png'],
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/tiff': ['.tiff', '.tif'],
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    };

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        const newFiles = acceptedFiles.map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            status: 'pending',
            progress: 0,
            error: null,
            uploadedAt: new Date().toISOString()
        }));
        setFiles(prev => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        accept: acceptedTypes,
        maxSize,
        multiple
    });

    const removeFile = (fileId) => {
        setFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const uploadFiles = async () => {
        if (files.length === 0) return;
        setUploading(true);

        for (const fileItem of files) {
            if (fileItem.status !== 'pending') continue;

            try {
                setFiles(prev => prev.map(f =>
                    f.id === fileItem.id ? { ...f, status: 'uploading', progress: 0 } : f
                ));

                const formData = new FormData();
                formData.append('file', fileItem.file);

                const response = await fetch('http://localhost:8000/upload/', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    setFiles(prev => prev.map(f =>
                        f.id === fileItem.id ? { ...f, status: 'success', progress: 100 } : f
                    ));

                    if (onUpload) {
                        onUpload(fileItem.file);
                    }
                } else {
                    throw new Error('Upload failed');
                }
            } catch (error) {
                setFiles(prev => prev.map(f =>
                    f.id === fileItem.id ? { ...f, status: 'error', error: error.message } : f
                ));
            }
        }

        setUploading(false);
    };

    const getFileIcon = (fileType, fileName) => {
        const extension = fileName.split('.').pop()?.toLowerCase();

        if (fileType.includes('pdf')) return <FileText className="h-5 w-5 text-red-700" />;
        if (fileType.includes('image')) return <Image className="h-5 w-5 text-emerald-700" />;
        if (fileType.includes('excel') || fileType.includes('spreadsheet') || extension === 'csv')
            return <FileSpreadsheet className="h-5 w-5 text-emerald-700" />;
        if (fileType.includes('word') || extension === 'docx' || extension === 'doc')
            return <FileText className="h-5 w-5 text-blue-700" />;
        return <File className="h-5 w-5 text-slate-600" />;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success': return <CheckCircle2 className="h-4 w-4 text-emerald-700" />;
            case 'error': return <AlertCircle className="h-4 w-4 text-red-700" />;
            case 'uploading': return <Clock className="h-4 w-4 text-blue-700 animate-spin" />;
            default: return <Clock className="h-4 w-4 text-slate-400" />;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getSupportedTypes = () => {
        return [
            'PDFs & Documents (PDF, DOC, DOCX)',
            'Email Files (EML, MSG)',
            'Spreadsheets (XLS, XLSX, CSV)',
            'Images & Scans (PNG, JPG, TIFF)',
            'Data Files (XML, CSV)'
        ];
    };

    return (
        <div className="space-y-6">
            {/* Professional Upload Area */}
            <Card className={cn(
                "border-2 border-dashed transition-all duration-300 hover:border-slate-400 shadow-lg",
                isDragActive ? "border-slate-500 bg-slate-50 scale-[1.02] shadow-xl" : "border-slate-300"
            )}>
                <CardContent className="p-8">
                    <div
                        {...getRootProps()}
                        className="flex flex-col items-center justify-center space-y-6 cursor-pointer"
                    >
                        <input {...getInputProps()} />

                        <div className={cn(
                            "p-6 rounded-full transition-all duration-300 border",
                            isDragActive ? "bg-slate-100 scale-110 border-slate-400" : "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200"
                        )}>
                            <Upload className={cn(
                                "h-8 w-8 transition-colors",
                                isDragActive ? "text-slate-700" : "text-slate-600"
                            )} />
                        </div>

                        <div className="text-center space-y-3">
                            <h3 className="text-xl font-semibold text-slate-800">
                                {isDragActive ? 'Drop files here' : 'Upload KMRL Documents'}
                            </h3>
                            <p className="text-slate-600 max-w-md">
                                Drag & drop your documents here, or click to browse and select files
                            </p>

                            {/* Supported file types */}
                            <div className="mt-4">
                                <p className="text-sm font-medium text-slate-700 mb-2">Supported file types:</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {getSupportedTypes().map((type, index) => (
                                        <Badge key={index} variant="outline" className="text-xs border-slate-300 text-slate-600">
                                            {type}
                                        </Badge>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    Maximum file size: {Math.round(maxSize / 1048576)}MB per file
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* File Rejections */}
            {fileRejections.length > 0 && (
                <Card className="border-red-300 bg-red-50 shadow-lg">
                    <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-red-800">Upload Errors</h4>
                                <ul className="mt-2 space-y-1">
                                    {fileRejections.map(({ file, errors }) => (
                                        <li key={file.name} className="text-sm text-red-700">
                                            <span className="font-medium">{file.name}:</span>{' '}
                                            {errors.map(e => e.message).join(', ')}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Professional File List */}
            {files.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-800">
                            Files ({files.length})
                        </h3>
                        <Button
                            onClick={uploadFiles}
                            disabled={uploading || files.every(f => f.status !== 'pending')}
                            className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 shadow-lg"
                        >
                            {uploading ? 'Processing...' : 'Upload All Files'}
                        </Button>
                    </div>

                    <div className="grid gap-3">
                        {files.map((fileItem) => (
                            <Card key={fileItem.id} className="p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200">
                                <div className="flex items-center space-x-4">
                                    {getFileIcon(fileItem.file.type, fileItem.file.name)}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-medium text-slate-900 truncate">
                                                {fileItem.file.name}
                                            </h4>
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(fileItem.status)}
                                                <Badge className={cn(
                                                    "border font-semibold",
                                                    fileItem.status === 'success' && "bg-emerald-50 text-emerald-800 border-emerald-300",
                                                    fileItem.status === 'error' && "bg-red-50 text-red-800 border-red-300",
                                                    fileItem.status === 'uploading' && "bg-blue-50 text-blue-800 border-blue-300",
                                                    fileItem.status === 'pending' && "bg-slate-50 text-slate-700 border-slate-300"
                                                )}>
                                                    {fileItem.status}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-xs text-slate-600">
                                                {formatFileSize(fileItem.file.size)} • {fileItem.file.type || 'Unknown type'}
                                            </p>
                                            {fileItem.uploadedAt && (
                                                <p className="text-xs text-slate-500">
                                                    {new Date(fileItem.uploadedAt).toLocaleTimeString()}
                                                </p>
                                            )}
                                        </div>

                                        {fileItem.status === 'uploading' && (
                                            <Progress value={fileItem.progress} className="mt-2 bg-slate-200" />
                                        )}

                                        {fileItem.error && (
                                            <p className="text-xs text-red-700 mt-1 font-medium">{fileItem.error}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {fileItem.status === 'success' && (
                                            <Button variant="outline" size="sm" className="border-slate-300 text-slate-600 hover:bg-slate-50">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeFile(fileItem.id)}
                                            className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
