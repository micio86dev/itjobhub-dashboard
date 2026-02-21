export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiError {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
}

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship' | string;
export type ContractType = 'Permanent' | 'Fixed-term' | 'Freelance' | string;
export type ExperienceLevel = 'Junior' | 'Mid' | 'Senior' | 'Lead' | string;
export type LoginMethod = 'email' | 'google' | 'linkedin' | 'github';

export interface LocationGeo {
    type: string; // usually "Point"
    coordinates: number[]; // [lng, lat]
}

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    oauth_provider?: string;
    oauth_id?: string;
    phone?: string;
    location?: string;
    bio?: string;
    birthDate?: string;
    avatar?: string;
    created_at?: string;
    updated_at?: string;
    profile?: UserProfile;
}

export interface UserProfile {
    id: string;
    user_id: string;
    languages: string[];
    skills: string[];
    seniority?: string;
    availability?: string;
    workModes: string[];
    cv_url?: string;
    bio?: string;
    location?: string;
    location_geo?: LocationGeo;
    github?: string;
    linkedin?: string;
    website?: string;
}

export interface Company {
    id: string;
    name: string;
    description?: string;
    website?: string;
    industry?: string;
    size?: string;
    location?: string;
    logo?: string;
    logo_url?: string;
    trustScore: number;
    totalRatings: number;
    totalLikes: number;
    totalDislikes: number;
    created_at?: string;
    updated_at?: string;
}

export interface Seniority {
    id: string;
    level: string;
}

export interface Job {
    id: string;
    company_id?: string;
    seniority_id?: string;
    title: string;
    description: string;
    link?: string;
    source?: string;
    original_language?: string;
    language?: string;
    published_at?: string;

    requirements: string[];
    benefits: string[];
    salary_min?: number;
    salary_max?: number;

    location?: string;
    remote: boolean;
    is_remote?: boolean;

    formatted_address?: string;
    city?: string;
    country?: string;

    location_geo?: LocationGeo;
    formatted_address_verified?: string;
    location_raw?: string;

    employment_type?: JobType;
    experience_level?: ExperienceLevel;
    seniority?: string;

    skills: string[];
    technical_skills: string[];

    views_count: number;
    clicks_count: number;
    status: string;
    created_at?: string;
    updated_at?: string;
    expires_at?: string;

    company?: Company;
    seniority_ref?: Seniority;
}

export interface NewsTranslation {
    language: string;
    title: string;
    summary?: string;
    content?: string;
}

export interface News {
    id: string;
    title: string;
    slug: string;
    summary?: string;
    content?: string;
    source_url?: string;
    image_url?: string;
    category?: string;
    language?: string;
    translations: NewsTranslation[];
    is_published: boolean;
    published_at?: string;
    views_count: number;
    clicks_count: number;
    created_at?: string;
    updated_at?: string;
}

export interface AnalyticsOverview {
    users: number;
    jobs: number;
    companies: number;
    news: number;
    usersChange?: number;
    jobsChange?: number;
}

export interface SearchLog {
    keyword: string;
    count: number;
    trend: 'up' | 'down' | 'flat';
}

export interface LoginStat {
    method: LoginMethod;
    count: number;
}
