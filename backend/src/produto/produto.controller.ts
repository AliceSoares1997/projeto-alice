import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { VincularFornecedoresDto } from 'src/produto-fornecedor/dto/vincularFornecedores.dto';
import { CriarProdutoDto } from './dto/criar-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ProdutoService } from './produto.service';

@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  async create(@Body() createProdutoDto: CriarProdutoDto) {
    const produto = await this.produtoService.findByCodigoBarras(
      createProdutoDto.codigo_barras,
    );

    if (produto) {
      throw new ConflictException(
        'Produto com este código de barras já está cadastrado!',
      );
    }

    return this.produtoService.create(createProdutoDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ) {
    const product = await this.produtoService.findById(parseInt(id));
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.produtoService.update(parseInt(id), updateProdutoDto);
  }

  @Get()
  async findAll() {
    const produtos = await this.produtoService.findAll();
    return produtos.map((produto) => {
      const { produtoFornecedor, ...rest } = produto;
      return {
        ...rest,
        fornecedores:
          produtoFornecedor?.map((pf) => ({
            idVinculo: pf.id,
            ...pf.fornecedor,
          })) || [],
      };
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const product = await this.produtoService.findById(parseInt(id));
    console.log(product);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    const { produtoFornecedor, ...rest } = product;
    return {
      ...rest,
      fornecedores:
        produtoFornecedor?.map((pf) => ({
          idVinculo: pf.id,
          ...pf.fornecedor,
        })) || [],
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const product = await this.produtoService.findById(parseInt(id));

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    await this.produtoService.delete(parseInt(id));
    return { message: 'Produto deletado com sucesso' };
  }

  @Post(':id/fornecedor')
  async vincularFornecedor(
    @Param('id') id: string,
    @Body() vincularFornecedorDto: VincularFornecedoresDto,
  ) {
    const produto = await this.produtoService.findById(parseInt(id));
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    const resultado = await this.produtoService.vincularFornecedor(
      produto,
      vincularFornecedorDto,
    );

    if (resultado.naoCadastrou.length > 0) {
      throw new ConflictException(
        'Esse fornecedor já está vinculado a este produto',
      );
    }

    return resultado;
  }

  @Delete(':id/fornecedor/:fornecedorId')
  async desvincularFornecedor(
    @Param('id') id: string,
    @Param('fornecedorId') fornecedorId: string,
  ) {
    const produto = await this.produtoService.findById(parseInt(id));
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.produtoService.desvincularFornecedor(
      produto,
      parseInt(fornecedorId),
    );
  }
}
