import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type PositionDocument = Position & Document;

@Schema()
export class Position{

    @Prop()
    deposit: number
    
    @Prop()
    enterTime: number
    
    @Prop()
    enterPrice: number
    
    @Prop()
    avegarePrice: number
    
    @Prop()
    positionType: string
    
    @Prop()
    status: boolean
    
    @Prop()
    volume: number
    
    @Prop()
    volumeUSDT: number
    
    @Prop()
    enterStep: number
    
    @Prop()
    closePrice: number
    
    @Prop()
    closeTime: number
    
    @Prop()
    percentProfit: number
    
    @Prop()
    sumProfit: number
    
    @Prop()
    patternEnter: number
    
    @Prop()
    lastEnterPrice: number
    
    @Prop()
    minPrice: number
    
    @Prop()
    minPricePercent: number
    
    @Prop([Object])
    positionEnters: object[]
}

export const PositionSchema = SchemaFactory.createForClass(Position);