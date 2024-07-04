const TotalBillList = (tx) => {

  const taxAmount = tx?.billList?.tax?.amount
  const taxPercent = tx?.billList?.tax?.percent
  const taxType = tx?.billList?.tax?.type

  const discountAmount = tx?.billList?.discount?.amount
  const discountPercent = tx?.billList?.discount?.percent
  const discountType = tx?.billList?.discount?.type

  const billList = tx?.billList?.items

  let totalItemsTax = 0
  let finalTaxAmount = 0
  let finalDiscountAmount = 0
  let totalItemsAmount = 0


  //for items

  billList && billList.length > 0 && billList.map((item) => {
    const amount = (item?.qTy) * (item?.rate)
    totalItemsAmount = totalItemsAmount + amount

    if (item?.tax && tx?.billList?.tax?.enabled && taxType === "%") {
      totalItemsTax = totalItemsTax + amount * (taxPercent / 100)
    }
  })


  //for tax

  if (billList && tx?.billList?.tax?.enabled) {
    if (taxType === "%") {
      finalTaxAmount = totalItemsTax
    } else if (taxType === "$") {
      finalTaxAmount = taxAmount
    }
  }

  // for discount

  if (billList && tx?.billList?.discount?.enabled) {

    if (tx?.billList?.orderReverse) {
      const totalAmountWithTax = totalItemsAmount + finalTaxAmount
      if (discountType === "$") {
        finalDiscountAmount = discountAmount
      } else if (discountType === "%") {
        finalDiscountAmount = totalAmountWithTax * (discountPercent / 100)
        console.log("discount " + finalDiscountAmount)
      }
    } else {
      if (discountType === "$") {
        finalDiscountAmount = discountAmount
      } else if (discountType === "%") {
        finalDiscountAmount = totalItemsAmount * (discountPercent / 100)
      }
    }

  }

  const totalWithTaxDiscount = totalItemsAmount + finalTaxAmount - finalDiscountAmount

return {
  subTotal: totalItemsAmount,
  totalTax : finalTaxAmount,
  totalDiscount : finalDiscountAmount,
  grandTotal: totalWithTaxDiscount
};

};

export default TotalBillList;
