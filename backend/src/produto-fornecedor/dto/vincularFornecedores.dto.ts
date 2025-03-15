import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class VincularFornecedoresDto {
  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  fornecedores: number[];
}
