import { Lugar } from './lugar'
import { Transicao } from './transicao'

export class Conexao {
  lugar: Lugar
  transicao: Transicao
  peso: number
  ehEntrada: boolean
  ehConexaoInibidora: boolean
  ehConexaoReset: boolean

  constructor(
    lugar: Lugar,
    transicao: Transicao,
    peso: number,
    ehEntrada: boolean,
    ehConexaoInibidora: boolean,
    ehConexaoReset: boolean
  ) {
    this.lugar = lugar
    this.transicao = transicao
    this.peso = peso
    this.ehEntrada = ehEntrada
    this.ehConexaoInibidora = ehConexaoInibidora
    this.ehConexaoReset = ehConexaoReset
  }

  public getLugar(): Lugar {
    return this.lugar
  }

  public getTransicao(): Transicao {
    return this.transicao
  }

  public getPeso(): number {
    return this.peso
  }

  public getEhEntrada(): boolean {
    return this.ehEntrada
  }
  public getEhConexaoInibidora(): boolean {
    return this.ehConexaoInibidora
  }

  public getEhConexaoReset(): boolean {
    return this.ehConexaoReset
  }

  public toString(): string {
    return this.getLugar().toString() + ' ' + this.getTransicao().toString() +
     ' eh entrada --> ' + this.getEhEntrada() + ' eh inibidora --> ' + this.getEhConexaoInibidora() + ' eh reset --> ' + this.getEhConexaoReset()
  }
}
