import {
  Body,
  Controller,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ProdutoService } from 'src/produto/produto.service';
import { VincularFornecedoresDto } from './dto/vincularFornecedores.dto';
import { ProdutoFornecedorService } from './produto-fornecedor.service';

@Controller('produto-fornecedor')
export class ProdutoFornecedorController {
  constructor(
    private readonly produtoService: ProdutoService,
    private readonly produtoFornecedorService: ProdutoFornecedorService,
  ) {}

  // Vincula fornecedores a um produto
  @Post(':id/fornecedores')
  async vincularFornecedores(
    @Param('id', ParseIntPipe) id: number,
    @Body() vincularFornecedoresDto: VincularFornecedoresDto,
  ) {
    const produto = await this.produtoService.findById(id);
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.produtoFornecedorService.vincularFornecedores(
      produto,
      vincularFornecedoresDto,
    );
  }
}
