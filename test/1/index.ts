import { readFileSync } from 'fs'
import { parseStringPromise, processors } from 'xml2js'
import prompt from 'prompt-sync'

import { Lugar } from '../../src/lugar'
import { RedePetri } from '../../src/redeDePetri'
import { Transicao } from '../../src/transicao'

run()

async function run() {
  const xml = readFileSync(__dirname + '/file.pflow', { encoding: 'utf8' })

  const {
    document: { subnet },
  } = await parseStringPromise(xml, {
    valueProcessors: [processors.parseNumbers],
  })

  const rede = new RedePetri()
  const componentesRede: any = {}

  let [{ place: places, transition: transitions, arc: arcs }] = subnet

  places = places.sort(compareValues('label'))
  transitions = transitions.sort(compareValues('label'))

  for (const place of places) {
    componentesRede[place.id[0]] = rede.criaLugar(
      place.id[0],
      place.label[0],
      place.tokens[0]
    )
  }

  for (const transition of transitions) {
    componentesRede[transition.id[0]] = rede.criaTransicao(
      transition.id[0],
      transition.label[0]
    )
  }

  for (const arc of arcs) {
    // arc.type -> regular

    let ehEntrada: boolean
    let lugar: Lugar
    let transicao: Transicao

    if (componentesRede[arc.sourceId[0]] instanceof Lugar) {
      ehEntrada = true
      lugar = componentesRede[arc.sourceId[0]]
      transicao = componentesRede[arc.destinationId[0]]
    } else {
      ehEntrada = false
      lugar = componentesRede[arc.destinationId[0]]
      transicao = componentesRede[arc.sourceId[0]]
    }

    rede.criaConexao(
      lugar,
      transicao,
      arc.multiplicity[0],
      ehEntrada,
      false,
      false
    )
  }

  rede.atualizaStatusTransicoes()
  rede.registrarLogInicial()

  while (true) {
    console.log('\n=== Execução ===')
    console.log('1. Executar ciclo')
    console.log('2. Exibir lugares')
    console.log('3. Exibir transições')
    console.log('4. Exibir rede')
    console.log('9. Sair')
    console.log()

    const option = prompt({ sigint: true })('')

    switch (option) {
      case '1':
        rede.executaCiclo()
        break
      case '2':
        rede.exibeLugares()
        break
      case '3':
        rede.exibeTransicoes()
        break
      case '4':
        rede.exibeRede()
        break
      case '9':
        console.log('Parando execução!')
        break
      default:
        console.log('Opção inválida.')
        break
    }

    if (option === '9') {
      break
    }
  }
}

function compareValues(key: string, order = 'asc') {
  return function innerSort(a: any, b: any) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0
    }

    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key]
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key]

    let comparison = 0
    if (varA > varB) {
      comparison = 1
    } else if (varA < varB) {
      comparison = -1
    }
    return order === 'desc' ? comparison * -1 : comparison
  }
}
