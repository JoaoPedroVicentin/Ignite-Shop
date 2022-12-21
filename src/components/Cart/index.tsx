import * as Dialog from '@radix-ui/react-dialog'
import { CartButton } from "../CartButton";
import { CartClose, CartContent, CartFinalization, CartProduct, CartProductDetails, CartProductImage, FinalizationDetails } from './styles';
import { X } from 'phosphor-react'
import Image from 'next/future/image';
import { useCart } from '../../hooks/useCart';
import { useState } from 'react';
import axios from 'axios';

export function Cart() {
    const { cartItems, removeCartItem, cartTotal } = useCart()
    const cartQuantity = cartItems.length

    const formattedCartTotal = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(cartTotal)

    const [isCreateCheckoutSession, setIsCreateCheckoutSession] = useState(false)

    async function handleCheckout() {
        try {
            setIsCreateCheckoutSession(true)

            const response = await axios.post('/api/checkout', {
                products: cartItems
            })
            const { checkoutUrl } = response.data
            window.location.href = checkoutUrl
        } catch (err) {
            setIsCreateCheckoutSession(false)
            alert('Falha ao redirecionar ao checkout!')
        }
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <CartButton />
            </Dialog.Trigger>

            <Dialog.Portal>
                <CartContent>
                    <CartClose>
                        <X size={24} weight='bold' />
                    </CartClose>

                    <h2>Sacola de compras</h2>

                    <section>
                        {cartQuantity <= 0 && <p>Parece que seu carrinho está vazinho</p>}

                        {cartItems.map(cartItem => (
                            <CartProduct key={cartItem.id}>
                                <CartProductImage>
                                    <Image width={100} height={93} alt="" src={cartItem.imageUrl} />
                                </CartProductImage>
                                <CartProductDetails>
                                    <p>{cartItem.name}</p>
                                    <strong>{cartItem.price}</strong>
                                    <button onClick={() => removeCartItem(cartItem.id)}>Remover</button>
                                </CartProductDetails>
                            </CartProduct>
                        ))}
                    </section>

                    <CartFinalization>
                        <FinalizationDetails>
                            <div>
                                <span>Quantidade</span>
                                <p>{cartQuantity} {cartQuantity === 1 ? 'item' : 'itens'}</p>
                            </div>
                            <div>
                                <span> Valor Total</span>
                                <p>{formattedCartTotal}</p>
                            </div>
                        </FinalizationDetails>

                        <button
                            onClick={handleCheckout}
                            disabled={isCreateCheckoutSession || cartQuantity <= 0}
                        >
                            Finalizar compra
                        </button>
                    </CartFinalization>
                </CartContent>
            </Dialog.Portal>
        </Dialog.Root>
    )
}