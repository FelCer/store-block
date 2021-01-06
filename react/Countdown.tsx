import React, { useState } from 'react'
import { TimeSplit } from './typings/global'
import { tick, getTwoDaysFromNow } from './utils/time'
import { useCssHandles } from 'vtex.css-handles'
// import { FormattedMessage } from 'react-intl'
import { useQuery } from 'react-apollo'
import useProduct from 'vtex.product-context/useProduct'
import productReleaseDate from './queries/productReleaseDate.graphql'

interface CountdownProps {
  // title: string,
  //targetDate: string
}
/*
   Funcion que se encuentra en ./utils/time.
   La funcion toma la fecha del dia de hoy(actual) y le agrega dos dias. 
   Retornando la fecha en string en el formato -> 2011-10-05T14:48:00.000Z
*/
const DEFAULT_TARGET_DATE = getTwoDaysFromNow();
/* 
  Son los identificadores(id) que van estar en las clases para que pinte sus respectivas clases
*/
const CSS_HANDLES = ['countdown']; 

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({
  // title,
  // targetDate = DEFAULT_TARGET_DATE,
}) => {

  /**
   * Declaras un hook de reac -> Basicamente creas un estado con hours, minutes y seconds
   * Para despues acceder a sus estados mediante la variable timeRemaining.
   * Y
   * Para actualizar esos estados con la funcion setTime
   */
  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  // const titleText = title || <FormattedMessage id="countdown.title" />
  const handles = useCssHandles(CSS_HANDLES);
  /**
   * Se utiliza la libreria vtex.product-context/useProduct y su funcion useProduct()
  */  
  const { product } = useProduct();
  /**
   * Se utiliza el hooks de useQuery, pasandole la consulta de graphql
   */
  const { data, loading, error } = useQuery(productReleaseDate, {
    variables: {
      slug: product?.linkText
    },
    ssr: false
  });

  if (!product) {
    return (
      <div>
        <span>No existe tal prodcuto.</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        <span>Cargando... espere unos segundos, por favor</span>
      </div>
    )
  }
  if (error) {
    return (
      <div>
        <span>Se presento un Error!</span>
      </div>
    )
  }

  //tick(targetDate, setTime)
  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime)

  return (
    // <div className={`${handles.container} t-heading-2 fw3 w-100 c-muted-1`}>
    //   <div className={`${handles.title} db tc`}>{titleText}</div>
    //   <div className={`${handles.countdown} c-muted-1 db tc`}>
    //         <h1>{ `${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}` }</h1>
    //   </div>
    // </div>  
    
    <div className={`${handles.countdown} c-muted-1 db tc`}>
      <h1>{ `${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}` }</h1>
    </div>
  )
}

Countdown.schema = {
  title: 'TEST 2',
  description: 'aloha',
  type: 'object',
  properties: {
    // title: {
    //   title: 'Este es el titulo de felipe ;)',
    //   type: 'string',
    //   default: null,
    // },
    targetDate:{
      title: 'Final Date for Felipe Garcia',
      description: 'Final date used in the countdown',
      type: 'string',
      default: null
    },
  },
}

export default Countdown
