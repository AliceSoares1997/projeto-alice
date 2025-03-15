import { PartialType } from '@nestjs/mapped-types';
import { CriarProdutoDto } from './criar-produto.dto';

export class UpdateProdutoDto extends PartialType(CriarProdutoDto) {}
