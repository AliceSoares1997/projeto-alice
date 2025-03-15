import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CriarProdutoDto {
  @IsNotEmpty({ message: 'O nome do produto é obrigatório' })
  @IsString({ message: 'O nome do produto deve ser uma string' })
  nome: string;

  @IsOptional({ message: 'O código de barras do produto é obrigatório' })
  @IsString({ message: 'O código de barras do produto deve ser uma string' })
  codigo_barras: string;

  @IsNotEmpty({ message: 'A descrição do produto é obrigatória' })
  @IsString({ message: 'A descrição do produto deve ser uma string' })
  descricao: string;

  @IsNotEmpty({ message: 'O estoque do produto é obrigatório' })
  @IsNumber({}, { message: 'O estoque do produto deve ser um número' })
  estoque: number;

  @IsOptional({ message: 'A data de validade do produto é obrigatória' })
  @IsDateString(
    {},
    { message: 'A data de validade do produto deve ser uma data' },
  )
  data_validade: string;

  @IsNotEmpty({ message: 'A categoria do produto é obrigatória' })
  @IsString({ message: 'A categoria do produto deve ser uma string' })
  categoria: string;

  @IsOptional({ message: 'A imagem do produto é obrigatória' })
  @IsString({ message: 'A imagem do produto deve ser uma string' })
  produto_imagem: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  fornecedores_ids: number[];
}
