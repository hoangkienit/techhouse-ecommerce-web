import { Types } from 'mongoose';

export interface ICreateLoyaltyTransaction {
    userId: string; 
    type: string; 
    points: number; 
    orderId: string;
}

export interface ILoyalty {
  _id?: Types.ObjectId;          
  user: Types.ObjectId;         
  type: 'earn' | 'spend';         
  points: number;            
  order?: Types.ObjectId;       
  createdAt?: Date;               
}