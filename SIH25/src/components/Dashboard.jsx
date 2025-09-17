import React, { useState } from 'react';
import {
    FileText,
    Upload,
    Search,
    BarChart3,
    Clock,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    Download,
    Database,
    Activity,
    Shield,
    Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import FileUpload from './FileUpload';

const Dashboard = ({ activeView, onViewChange }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const stats = [
        {
            title: "Total Documents",
            value: "2,847",
            change: "+12%",
            changeType: "increase",
            icon: FileText,
            gradient: "from-slate-600 to-slate-800",
            bgGradient: "from-slate-50 to-slate-100",
            borderColor: "border-slate-200",
            description: "Documents processed"
        },
        {
            title: "Processed Today",
            value: "127",
            change: "+23%",
            changeType: "increase",
            icon: CheckCircle2,
            gradient: "from-emerald-700 to-emerald-900",
            bgGradient: "from-emerald-50 to-emerald-100",
            borderColor: "border-emerald-200",
            description: "Successfully processed"
        },
        {
            title: "Processing Queue",
            value: "8",
            change: "-45%",
            changeType: "decrease",
            icon: Clock,
            gradient: "from-amber-600 to-amber-800",
            bgGradient: "from-amber-50 to-amber-100",
            borderColor: "border-amber-200",
            description: "Pending processing"
        },
        {
            title: "Storage Used",
            value: "78%",
            change: "+5%",
            changeType: "increase",
            icon: Database,
            gradient: "from-indigo-700 to-indigo-900",
            bgGradient: "from-indigo-50 to-indigo-100",
            borderColor: "border-indigo-200",
            description: "Of total capacity"
        }
    ];

    const recentActivity = [
        {
            action: "Document Uploaded",
            document: "Safety Protocol Update Q4-2024.pdf",
            user: "System Admin",
            time: "2 minutes ago",
            status: "completed",
            type: "upload"
        },
        {
            action: "Query Processed",
            document: "What are the new safety regulations for metro operations?",
            user: "Operations Manager",
            time: "5 minutes ago",
            status: "completed",
            type: "query"
        },
        {
            action: "Document Processing",
            document: "Maintenance Report October 2024.docx",
            user: "Maintenance Team",
            time: "8 minutes ago",
            status: "processing",
            type: "processing"
        },
        {
            action: "Compliance Check",
            document: "Environmental Impact Assessment 2024.pdf",
            user: "Compliance Officer",
            time: "12 minutes ago",
            status: "warning",
            type: "compliance"
        }
    ];

    const handleFileUpload = (file) => {
        setUploadedFiles(prev => [...prev, {
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2),
            uploadedAt: new Date().toLocaleString(),
            status: 'uploaded',
            type: file.type
        }]);
    };

    const downloadFile = async (filename) => {
        try {
            const response = await fetch(`http://localhost:8000/download/${filename}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    if (activeView === 'Upload Documents') {
        return (
            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 via-slate-900 to-indigo-900 bg-clip-text text-transparent">
                        Upload Documents
                    </h1>
                    <p className="text-lg text-slate-600 max-w-4xl leading-relaxed">
                        Upload and process documents for the KMRL document management system.
                        Our intelligent system supports various document types including PDFs, emails,
                        spreadsheets, and scanned images with advanced OCR capabilities.
                    </p>
                </div>

                <FileUpload onUpload={handleFileUpload} />

                {uploadedFiles.length > 0 && (
                    <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-slate-50 to-slate-100">
                        <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                            <CardTitle className="flex items-center space-x-3">
                                <div className="p-2 bg-slate-100 rounded-xl border border-slate-200">
                                    <Activity className="h-5 w-5 text-slate-700" />
                                </div>
                                <span className="text-slate-800">Recently Uploaded Files</span>
                            </CardTitle>
                            <CardDescription className="text-slate-600">Files uploaded in this session</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {uploadedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl border border-slate-300">
                                                <FileText className="h-6 w-6 text-slate-700" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{file.name}</p>
                                                <p className="text-sm text-slate-600">{file.size} MB • {file.uploadedAt}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Badge className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300">
                                                ✓ {file.status}
                                            </Badge>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => downloadFile(file.name)}
                                                className="hover:bg-slate-50 hover:border-slate-300 border-slate-200 text-slate-700 transition-colors"
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        );
    }

    // Default Dashboard View
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Professional Header */}
            <div className="space-y-6">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-700 via-slate-900 to-indigo-900 bg-clip-text text-transparent">
                        KMRL Document Assistant
                    </h1>
                    <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                        Your intelligent document management system for Kochi Metro Rail Limited.
                        Streamline document processing, enhance compliance, and accelerate decision-making across all departments.
                    </p>
                </div>
            </div>

            {/* Professional Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card
                            key={index}
                            className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${stat.borderColor} border`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-60`} />
                            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                                <CardTitle className="text-sm font-semibold text-slate-700">{stat.title}</CardTitle>
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                    <Icon className="h-5 w-5 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                                <div className="flex items-center justify-between">
                                    <div className={`flex items-center text-sm font-semibold ${stat.changeType === 'increase' ? 'text-emerald-700' : 'text-red-600'
                                        }`}>
                                        <TrendingUp className="h-4 w-4 mr-1" />
                                        <span>{stat.change}</span>
                                    </div>
                                    <span className="text-xs text-slate-500">vs last month</span>
                                </div>
                                <p className="text-xs text-slate-600 mt-2">{stat.description}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Professional Quick Actions */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-slate-50 to-slate-100">
                <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                    <CardTitle className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-100 rounded-xl border border-slate-200">
                            <Activity className="h-5 w-5 text-slate-700" />
                        </div>
                        <span className="text-slate-800">Quick Actions</span>
                    </CardTitle>
                    <CardDescription className="text-slate-600">Streamline your document management workflow</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Button
                            className="h-36 flex flex-col space-y-4 bg-gradient-to-br from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                            onClick={() => onViewChange('Upload Documents')}
                        >
                            <Upload className="h-10 w-10" />
                            <div className="text-center">
                                <span className="font-semibold text-lg">Upload Documents</span>
                                <p className="text-sm opacity-90 mt-1">Process new files</p>
                            </div>
                        </Button>

                        <Button
                            variant="outline"
                            className="h-36 flex flex-col space-y-4 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-slate-700"
                            onClick={() => onViewChange('Search & Query')}
                        >
                            <Search className="h-10 w-10" />
                            <div className="text-center">
                                <span className="font-semibold text-lg">Search Documents</span>
                                <p className="text-sm text-slate-600 mt-1">Find information fast</p>
                            </div>
                        </Button>

                        <Button
                            variant="outline"
                            className="h-36 flex flex-col space-y-4 border-2 border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-slate-700"
                            onClick={() => onViewChange('Analytics')}
                        >
                            <BarChart3 className="h-10 w-10" />
                            <div className="text-center">
                                <span className="font-semibold text-lg">View Analytics</span>
                                <p className="text-sm text-slate-600 mt-1">System insights</p>
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Professional Recent Activity */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-slate-50 to-slate-100">
                <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                    <CardTitle className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-100 rounded-xl border border-emerald-200">
                            <Activity className="h-5 w-5 text-emerald-700" />
                        </div>
                        <span className="text-slate-800">Recent Activity</span>
                    </CardTitle>
                    <CardDescription className="text-slate-600">Latest document processing activities across KMRL departments</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className={`p-3 rounded-full border ${activity.status === 'completed' ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 border-emerald-300' :
                                    activity.status === 'processing' ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300' :
                                        'bg-gradient-to-br from-amber-100 to-amber-200 border-amber-300'
                                    }`}>
                                    {activity.status === 'completed' ? (
                                        <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                                    ) : activity.status === 'processing' ? (
                                        <Clock className="h-5 w-5 text-blue-700" />
                                    ) : (
                                        <AlertTriangle className="h-5 w-5 text-amber-700" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-slate-900">{activity.action}</p>
                                        <Badge className={`border ${activity.status === 'completed' ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300' :
                                            activity.status === 'processing' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300' :
                                                'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300'
                                            }`}>
                                            {activity.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-slate-600 line-clamp-2">{activity.document}</p>
                                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                                        <span className="font-medium">{activity.user}</span>
                                        <span>•</span>
                                        <span>{activity.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Professional System Health */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-slate-50 to-slate-100">
                    <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                        <CardTitle className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-xl border border-blue-200">
                                <Activity className="h-5 w-5 text-blue-700" />
                            </div>
                            <span className="text-slate-800">System Performance</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-slate-700">Document Processing</span>
                                <span className="text-sm font-bold text-emerald-700">92%</span>
                            </div>
                            <Progress value={92} className="h-3 bg-slate-200" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-slate-700">Storage Capacity</span>
                                <span className="text-sm font-bold text-blue-700">78%</span>
                            </div>
                            <Progress value={78} className="h-3 bg-slate-200" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-slate-700">Network Latency</span>
                                <span className="text-sm font-bold text-emerald-700">15ms</span>
                            </div>
                            <Progress value={85} className="h-3 bg-slate-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-slate-50 to-slate-100">
                    <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                        <CardTitle className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-100 rounded-xl border border-indigo-200">
                                <FileText className="h-5 w-5 text-indigo-700" />
                            </div>
                            <span className="text-slate-800">Document Categories</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {[
                            { name: "Safety Circulars", count: 847, gradient: "from-red-100 to-red-200", text: "text-red-800", border: "border-red-300" },
                            { name: "Maintenance Reports", count: 623, gradient: "from-blue-100 to-blue-200", text: "text-blue-800", border: "border-blue-300" },
                            { name: "Compliance Documents", count: 394, gradient: "from-emerald-100 to-emerald-200", text: "text-emerald-800", border: "border-emerald-300" },
                            { name: "Board Minutes", count: 158, gradient: "from-indigo-100 to-indigo-200", text: "text-indigo-800", border: "border-indigo-300" },
                            { name: "Technical Drawings", count: 825, gradient: "from-amber-100 to-amber-200", text: "text-amber-800", border: "border-amber-300" }
                        ].map((category, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 hover:shadow-md transition-all duration-300">
                                <span className="text-sm font-semibold text-slate-700">{category.name}</span>
                                <Badge className={`bg-gradient-to-r ${category.gradient} ${category.text} ${category.border} border font-bold`}>
                                    {category.count}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
