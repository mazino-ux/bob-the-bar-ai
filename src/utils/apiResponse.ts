import { Response } from 'express';

/**
 * SUCCESS RESPONSE HELPER
 */
export const successResponse = (
  res: Response,
  data: any,
  message: string = 'Success',
  statusCode: number = 200
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * ERROR RESPONSE HELPER
 */
export const errorResponse = (
  res: Response,
  message: string = 'An error occurred',
  statusCode: number = 500,
  error?: any
) => {
  console.error(message, error);
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error?.message : undefined
  });
};