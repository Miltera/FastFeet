import Mail from '../../lib/Mail';

class DeliveryMail {
  get key() {
    return 'DeliveryMail';
  }

  async handle({ data }) {
    const { product, courier, recipient } = data.completeDelivery;

    //console.log(product, courier, recipient);

    await Mail.sendMail({
      to: `${courier.name} <${courier.email}>`,
      subject: 'Nova entrega disponível - Fastfeet',
      template: 'new_delivery',
      context: {
        deliveryman: courier.name,
        product: product,
        recipient: recipient.name,
        city: recipient.city,
        state: recipient.state,
        street: recipient.address,
        number: recipient.number,
        zip_code: recipient.zipCode,
      },
    });
  }
}

export default new DeliveryMail();
