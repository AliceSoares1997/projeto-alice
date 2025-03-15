import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VincularFornecedoresDto } from 'src/produto-fornecedor/dto/vincularFornecedores.dto';
import { ProdutoFornecedorService } from 'src/produto-fornecedor/produto-fornecedor.service';
import { Repository } from 'typeorm';
import { CriarProdutoDto } from './dto/criar-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Produto } from './produto.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
    private produtoFornecedorService: ProdutoFornecedorService,
  ) {}

  async create(createProdutoDto: CriarProdutoDto): Promise<Produto> {
    const produto = this.produtoRepository.create({
      nome: createProdutoDto.nome,
      codigo_barras: createProdutoDto.codigo_barras,
      descricao: createProdutoDto.descricao,
      estoque: createProdutoDto.estoque,
      data_validade: new Date(createProdutoDto.data_validade),
      categoria: createProdutoDto.categoria,
      produto_imagem: createProdutoDto.produto_imagem,
    });

    await this.produtoRepository.save(produto);

    if (
      createProdutoDto.fornecedores_ids &&
      createProdutoDto.fornecedores_ids.length > 0
    ) {
      await this.produtoFornecedorService.vincularFornecedores(produto, {
        fornecedores: createProdutoDto.fornecedores_ids,
      });
    }
    return produto;
  }

  async update(
    id: number,
    updateProdutoDto: UpdateProdutoDto,
  ): Promise<Produto> {
    const produto = await this.findById(id);
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    this.produtoRepository.merge(produto, updateProdutoDto);
    return this.produtoRepository.save(produto);
  }

  async findById(id: number): Promise<Produto | null> {
    return this.produtoRepository.findOne({
      where: { id },
      relations: ['produtoFornecedor.fornecedor'],
    });
  }

  async findAll(): Promise<Produto[]> {
    return this.produtoRepository.find({
      relations: ['produtoFornecedor.fornecedor'],
    });
  }

  async delete(id: number): Promise<void> {
    await this.produtoRepository.delete(id);
  }

  async findByCodigoBarras(codigo_barras: string): Promise<Produto | null> {
    return this.produtoRepository.findOne({
      where: { codigo_barras },
    });
  }

  async vincularFornecedor(
    produto: Produto,
    vincularFornecedorDto: VincularFornecedoresDto,
  ): Promise<{
    cadastrou: number[];
    naoCadastrou: { id: number; mensagem: string }[];
  }> {
    return await this.produtoFornecedorService.vincularFornecedores(
      produto,
      vincularFornecedorDto,
    );
  }

  async desvincularFornecedor(
    produto: Produto,
    fornecedorId: number,
  ): Promise<void> {
    await this.produtoFornecedorService.desvincularFornecedor(
      produto,
      fornecedorId,
    );
  }
}
