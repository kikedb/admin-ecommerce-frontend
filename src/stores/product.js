import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore('product', () => {
  const id = ref(null)
  const name = ref('')
  const sku = ref('')
  const barCode = ref('')
  const provisionalBarCode = ref('')
  const description = ref('')
  const shortDescription = ref('')
  const stock = ref(0)
  const criticalStock = ref(0)
  const price = ref(0)
  const coinType = ref('$')
  const mainImagePath = ref('')
  const categoryId = ref(null)
  const brandId = ref(null)
  const serieId = ref(null)
  const colorId = ref(null)
  const materialId = ref(null)
  const model = ref('')
  const condition = ref(null)
  const conditionDetail = ref('')
  const iva = ref(false)
  const isActive = ref(false)
  const urlYoutube = ref('')
  
  // Logistica
  const weight = ref('')
  const weightUnit = ref('')
  const logisticClass = ref('')
  const shippingCost = ref('')
  const shippingWay = ref('')
  const retreatInPerson = ref(false)
  
  // Dimensions
  const height = ref('')
  const width = ref('')
  const large = ref('')
  const depth = ref('')
  const measureUnit = ref('')
  
  // Warranty
  const warrantyType = ref('')
  const warrantyTime = ref('')
  const warrantyTimeUnit = ref('')
  
  // Images
  const images = ref([])
  const imagesPreviews = ref([])
  
  // Features
  const ageRange = ref('')
  const ageGroup = ref('')
  const capacity = ref('')
  const numberOfPieces = ref('')
  const productionCountry = ref('')
  const type = ref('')
  const sounds = ref(false)
  const usesBatteries = ref(false)
  const lights = ref(false)
  const smallPieces = ref(false)
  const microwaveSafe = ref(false)
  const dishwasherSafe = ref(false)
  const hipoalergenic = ref(false)
  const softMaterials = ref(false)
  const padded = ref(false)
  const adjustableHeight = ref(false)
  const bpaFree = ref(false)
  const features = ref('')
  const shape = ref('')
  const characteres = ref('')
  const decorationStyle = ref('')
  const typeOfHousehold = ref('')
  const decorationType = ref('')
  const wineGlassType = ref('')
  const units = ref('')
  const maxWeightSupported = ref('')

  function clearInputs() {
    id.value = null
    name.value = ''
    sku.value = ''
    barCode.value = ''
    provisionalBarCode.value = ''
    description.value = ''
    shortDescription.value = ''
    stock.value = 0
    criticalStock.value = 0
    price.value = 0
    coinType.value = '$'
    mainImagePath.value = ''
    categoryId.value = null
    brandId.value = null
    serieId.value = null
    colorId.value = null
    materialId.value = null
    model.value = ''
    condition.value = null
    conditionDetail.value = ''
    iva.value = false
    isActive.value = false
    urlYoutube.value = ''
    weight.value = ''
    weightUnit.value = ''
    logisticClass.value = ''
    shippingCost.value = ''
    shippingWay.value = ''
    retreatInPerson.value = false
    height.value = ''
    width.value = ''
    large.value = ''
    depth.value = ''
    measureUnit.value = ''
    warrantyType.value = ''
    warrantyTime.value = ''
    warrantyTimeUnit.value = ''
    images.value = []
    imagesPreviews.value = []
    ageRange.value = ''
    ageGroup.value = ''
    capacity.value = ''
    numberOfPieces.value = ''
    productionCountry.value = ''
    type.value = ''
    sounds.value = false
    usesBatteries.value = false
    lights.value = false
    smallPieces.value = false
    microwaveSafe.value = false
    dishwasherSafe.value = false
    hipoalergenic.value = false
    softMaterials.value = false
    padded.value = false
    adjustableHeight.value = false
    bpaFree.value = false
    features.value = ''
    shape.value = ''
    characteres.value = ''
    decorationStyle.value = ''
    typeOfHousehold.value = ''
    decorationType.value = ''
    wineGlassType.value = ''
    units.value = ''
    maxWeightSupported.value = ''
  }

  return {
    id,
    name,
    sku,
    barCode,
    provisionalBarCode,
    description,
    shortDescription,
    stock,
    criticalStock,
    price,
    coinType,
    mainImagePath,
    categoryId,
    brandId,
    serieId,
    colorId,
    materialId,
    model,
    condition,
    conditionDetail,
    iva,
    isActive,
    urlYoutube,
    weight,
    weightUnit,
    logisticClass,
    shippingCost,
    shippingWay,
    retreatInPerson,
    height,
    width,
    large,
    depth,
    measureUnit,
    warrantyType,
    warrantyTime,
    warrantyTimeUnit,
    images,
    imagesPreviews,
    ageRange,
    ageGroup,
    capacity,
    numberOfPieces,
    productionCountry,
    type,
    sounds,
    usesBatteries,
    lights,
    smallPieces,
    microwaveSafe,
    dishwasherSafe,
    hipoalergenic,
    softMaterials,
    padded,
    adjustableHeight,
    bpaFree,
    features,
    shape,
    characteres,
    decorationStyle,
    typeOfHousehold,
    decorationType,
    wineGlassType,
    units,
    maxWeightSupported,
    clearInputs
  }
})
