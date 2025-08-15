import { Prisma, Inquiry, InquiryStatus } from '@prisma/client';
import { prisma } from '../db/client';

type CreateInquiryData = Prisma.InquiryCreateInput;

export const createInquiry = async (data: CreateInquiryData): Promise<Inquiry> => {
  return prisma.inquiry.create({
    data: {
      ...data
    },
  });
}

export const listInquiries = async (): Promise<Inquiry[]> => {
  return prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' } });
}
