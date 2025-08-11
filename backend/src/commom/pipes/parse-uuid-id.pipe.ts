import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class ParseUuidIdPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type !== 'param' || metadata.data !== 'id') {
            return value;
        }
        
        if (!uuidValidate(value)) {
            throw new BadRequestException(`${value} não é um UUID válido`);
        }
        
        return value;
    }
}   