
import type { Asset, Folder, Tag } from "@/lib/types";

export const MOCK_FOLDERS: Folder[] = [
    {
        id: "f1",
        name: "Marketing",
        parentId: null,
        createdAt: new Date().toISOString(),
        organizationId: "o1",
        color: "blue",
        assetCount: 12
    },
    {
        id: "f2",
        name: "Product",
        parentId: null,
        createdAt: new Date().toISOString(),
        organizationId: "o1",
        color: "green",
        assetCount: 5
    },
    {
        id: "f3",
        name: "Campaign 2024",
        parentId: "f1",
        createdAt: new Date().toISOString(),
        organizationId: "o1",
        color: "purple",
        assetCount: 8
    }
];

export const MOCK_ASSETS: Asset[] = [
    {
        id: "a1",
        name: "hero-banner.jpg",
        description: "Main website hero banner",
        type: "image",
        mimeType: "image/jpeg",
        size: 2450000,
        folderId: "f3",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        updatedAt: new Date().toISOString(),
        uploadedBy: "u1",
        organizationId: "o1",
        r2Key: "assets/hero-banner.jpg",
        r2Bucket: "assets",
        thumbnailKey: "assets/hero-banner-thumb.jpg",
        width: "1920",
        height: "1080",
        thumbnailUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: "a2",
        name: "product-demo.mp4",
        description: "Q1 product walkthrough",
        type: "video",
        mimeType: "video/mp4",
        size: 45000000,
        folderId: "f2",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        updatedAt: new Date().toISOString(),
        uploadedBy: "u1",
        organizationId: "o1",
        r2Key: "assets/product-demo.mp4",
        r2Bucket: "assets",
        thumbnailKey: null,
        width: null,
        height: null,
    },
    {
        id: "a3",
        name: "quarterly-report.pdf",
        description: "Q4 Financials",
        type: "document",
        mimeType: "application/pdf",
        size: 1200000,
        folderId: "f1",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        updatedAt: new Date().toISOString(),
        uploadedBy: "u1",
        organizationId: "o1",
        r2Key: "assets/quarterly-report.pdf",
        r2Bucket: "assets",
        thumbnailKey: null,
        width: null,
        height: null,
    },
    {
        id: "a4",
        name: "logo-transparent.png",
        description: null,
        type: "image",
        mimeType: "image/png",
        size: 500000,
        folderId: "f1",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
        updatedAt: new Date().toISOString(),
        uploadedBy: "u1",
        organizationId: "o1",
        r2Key: "assets/logo.png",
        r2Bucket: "assets",
        thumbnailKey: "assets/logo-thumb.png",
        width: "500",
        height: "500",
        thumbnailUrl: "https://images.unsplash.com/photo-1626544827763-d516dce335ca?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: "a5",
        name: "meeting-recording.mp3",
        description: null,
        type: "audio",
        mimeType: "audio/mpeg",
        size: 15000000,
        folderId: null,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
        updatedAt: new Date().toISOString(),
        uploadedBy: "u1",
        organizationId: "o1",
        r2Key: "assets/meeting.mp3",
        r2Bucket: "assets",
        thumbnailKey: null,
        width: null,
        height: null,
    }
];

export const MOCK_TAGS: Tag[] = [
    { id: "t1", name: "urgent", color: "red", organizationId: "o1", createdAt: new Date().toISOString() },
    { id: "t2", name: "approved", color: "green", organizationId: "o1", createdAt: new Date().toISOString() },
    { id: "t3", name: "draft", color: "gray", organizationId: "o1", createdAt: new Date().toISOString() },
    { id: "t4", name: "social", color: "blue", organizationId: "o1", createdAt: new Date().toISOString() }
];
