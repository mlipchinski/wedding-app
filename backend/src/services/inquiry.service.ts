import { prisma } from '../db/client';
import { InquiryStatus } from '@prisma/client';

export async function createInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  guestCount: number;
  preferredLocation?: string;
  mood?: string;
  requestedDate?: string;
  budgetMin?: number;
  budgetMax?: number;
  message?: string;
}) {
  return prisma.inquiry.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      guestCount: data.guestCount,
      preferredLocation: data.preferredLocation,
      mood: data.mood,
      requestedDate: data.requestedDate ? new Date(data.requestedDate) : null,
      budgetMin: data.budgetMin,
      budgetMax: data.budgetMax,
      message: data.message,
      status: InquiryStatus.NEW
    }
  });
}

export async function listInquiries() {
  return prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' } });
}
