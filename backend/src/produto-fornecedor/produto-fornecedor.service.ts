import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from 'src/produto/produto.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { VincularFornecedoresDto } from './dto/vincularFornecedores.dto';
import { ProdutoFornecedor } from './produto-fornecedor.entity';

interface SQLiteError {
  errno: number;
  code: string;
}

@Injectable()
export class ProdutoFornecedorService {
  constructor(
    @InjectRepository(ProdutoFornecedor)
    private produtoFornecedorRepository: Repository<ProdutoFornecedor>,
  ) {}

  async vincularFornecedores(
    produto: Produto,
    vincularFornecedoresDto: VincularFornecedoresDto,
  ): Promise<{
    cadastrou: number[];
    naoCadastrou: { id: number; mensagem: string }[];
  }> {
    const produtoFornecedores = vincularFornecedoresDto.fornecedores.map(
      (fornecedorId) => ({
        produto: { id: produto.id },
        fornecedor: { id: Number(fornecedorId) },
      }),
    );

    console.log(produtoFornecedores);

    const resultado: {
      cadastrou: number[];
      naoCadastrou: { id: number; mensagem: string }[];
    } = {
      cadastrou: [],
      naoCadastrou: [],
    };

    for (const pf of produtoFornecedores) {
      try {
        await this.produtoFornecedorRepository.save(pf);
        resultado.cadastrou.push(pf.fornecedor.id);
      } catch (error) {
        console.log(error);
        if (
          error instanceof QueryFailedError &&
          (error.driverError as SQLiteError)?.code === 'SQLITE_CONSTRAINT'
        ) {
          resultado.naoCadastrou.push({
            id: pf.fornecedor.id,
            mensagem: 'Fornecedor já cadastrado para este produto',
          });
          continue;
        }
        throw error;
      }
    }

    return resultado;
  }

  async desvincularFornecedor(
    produto: Produto,
    fornecedorId: number,
  ): Promise<void> {
    await this.produtoFornecedorRepository.delete({
      produto: { id: produto.id },
      fornecedor: { id: fornecedorId },
    });
  }
}
