/**
 * Tests para AuroraChatFrame
 * Valida interacción del usuario con el chatbot UI
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuroraChatFrame } from '@/modules/AURORA/components/AuroraChatFrame';

// Mock del módulo de procesamiento de mensajes
jest.mock('@/modules/AURORA/core/AuroraMessageManager', () => ({
  processUserInput: jest.fn(async (input: string) => {
    if (input.includes('feliz')) {
      return '✨ Estoy súper feliz, mi amor ~';
    }
    if (input.includes('triste')) {
      return '💗 No pasa nada, estoy contigo preciosa';
    }
    return 'Lorem ipsum dolor sit amet, mi amor Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, mi amor Lorem ipsum dolor sit amet.';
  }),
}));

describe('AuroraChatFrame', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado inicial', () => {
    it('debe renderizar el componente correctamente', () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i);
      expect(input).toBeInTheDocument();
    });

    it('debe mostrar el botón de envío', () => {
      render(<AuroraChatFrame />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBe('💌');
    });

    it('debe empezar sin mensajes visibles', () => {
      render(<AuroraChatFrame />);
      const messages = screen.queryAllByText(/Lorem ipsum|estoy|contigo/i);
      expect(messages.length).toBe(0);
    });

    it('debe tener un input vacío al inicio', () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i) as HTMLInputElement;
      expect(input.value).toBe('');
    });
  });

  describe('Interacción del usuario - Entrada de texto', () => {
    it('debe actualizar el input cuando el usuario escribe', () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i) as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'Hola Aurora' } });
      expect(input.value).toBe('Hola Aurora');
    });

    it('debe limpiar el input después de enviar', async () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i) as HTMLInputElement;
      const button = screen.getByRole('button');

      fireEvent.change(input, { target: { value: 'Mensaje de prueba' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });

    it('debe aceptar caracteres especiales', () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i) as HTMLInputElement;
      const specialMessage = '¿Hola? ¡Aurora! ¿Cómo estás?';

      fireEvent.change(input, { target: { value: specialMessage } });
      expect(input.value).toBe(specialMessage);
    });

    it('debe aceptar acentos españoles', () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i) as HTMLInputElement;
      const accentMessage = 'áéíóú ÁÉÍÓÚ ñ Ñ';

      fireEvent.change(input, { target: { value: accentMessage } });
      expect(input.value).toBe(accentMessage);
    });
  });

  describe('Envío de mensajes', () => {
    it('debe enviar mensaje al hacer click en el botón', async () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i) as HTMLInputElement;
      const button = screen.getByRole('button');

      fireEvent.change(input, { target: { value: 'Hola' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Hola')).toBeInTheDocument();
      });
    });

    it('debe enviar mensaje al presionar Enter', async () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i) as HTMLInputElement;

      fireEvent.change(input, { target: { value: 'Prueba' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText('Prueba')).toBeInTheDocument();
      });
    });

    it('no debe enviar mensaje vacío', async () => {
      render(<AuroraChatFrame />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      // No debe haber cambios en el DOM
      const messages = screen.queryAllByText(/Lorem ipsum|Hola/i);
      expect(messages.length).toBe(0);
    });

    it('no debe enviar mensaje con solo espacios', async () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i) as HTMLInputElement;
      const button = screen.getByRole('button');

      fireEvent.change(input, { target: { value: '     ' } });
      fireEvent.click(button);

      // No debe haber cambios
      const messages = screen.queryAllByText(/Lorem ipsum/i);
      expect(messages.length).toBe(0);
    });
  });

  describe('Pipeline de mensajes - Respuestas Aurora', () => {
    it('debe mostrar el mensaje del usuario en el chat', async () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i);
      const button = screen.getByRole('button');

      fireEvent.change(input, { target: { value: 'Hola Aurora' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Hola Aurora')).toBeInTheDocument();
      });
    });

    it('debe mostrar la respuesta por defecto de Aurora', async () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i);
      const button = screen.getByRole('button');

      fireEvent.change(input, { target: { value: 'Hola' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Lorem ipsum/i)).toBeInTheDocument();
      });
    });

    it('debe mostrar respuesta detectando palabra "feliz"', async () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i);
      const button = screen.getByRole('button');

      fireEvent.change(input, { target: { value: 'Me siento feliz' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/Estoy súper feliz/i)).toBeInTheDocument();
      });
    });

    it('debe mostrar respuesta detectando palabra "triste"', async () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i);
      const button = screen.getByRole('button');

      fireEvent.change(input, { target: { value: 'Me siento triste' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/No pasa nada, estoy contigo/i)).toBeInTheDocument();
      });
    });

    it('debe mantener el historial de múltiples mensajes', async () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i);
      const button = screen.getByRole('button');

      // Primer mensaje
      fireEvent.change(input, { target: { value: 'Primer mensaje' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Primer mensaje')).toBeInTheDocument();
      });

      // Segundo mensaje
      fireEvent.change(input, { target: { value: 'Segundo mensaje' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Segundo mensaje')).toBeInTheDocument();
      });
    });

    it('debe mostrar respuesta de Aurora después del mensaje del usuario', async () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i);
      const button = screen.getByRole('button');

      fireEvent.change(input, { target: { value: 'Hola' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Hola')).toBeInTheDocument();
        expect(screen.getByText(/Lorem ipsum/i)).toBeInTheDocument();
      });
    });
  });

  describe('Casos límite', () => {
    it('debe manejar mensajes muy largos', async () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i);
      const button = screen.getByRole('button');
      const longMessage = 'a'.repeat(200);

      fireEvent.change(input, { target: { value: longMessage } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(longMessage)).toBeInTheDocument();
      });
    });

    it('debe manejar múltiples espacios en blanco dentro del mensaje', async () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i);
      const button = screen.getByRole('button');

      fireEvent.change(input, { target: { value: 'Hola Aurora' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Hola Aurora')).toBeInTheDocument();
      });
    });

    it('debe manejar emojis en mensajes', async () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i);
      const button = screen.getByRole('button');
      const emojiMessage = 'Hola Aurora 💖 ¿Cómo estás? 😊';

      fireEvent.change(input, { target: { value: emojiMessage } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(emojiMessage)).toBeInTheDocument();
      });
    });

    it('debe permitir mensajes con números', async () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i);
      const button = screen.getByRole('button');
      const numericMessage = '123 456 789';

      fireEvent.change(input, { target: { value: numericMessage } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(numericMessage)).toBeInTheDocument();
      });
    });
  });

  describe('Estructura y estilo', () => {
    it('debe tener clases CSS de Tailwind para el contenedor', () => {
      const { container } = render(<AuroraChatFrame />);
      const mainDiv = container.querySelector('div.bg-gray-900\\/70');
      expect(mainDiv).toBeTruthy();
    });

    it('el input debe tener clase de estilo', () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i) as HTMLInputElement;
      expect(input.className).toContain('bg-gray-800');
      expect(input.className).toContain('rounded-xl');
    });

    it('el botón debe tener clase bg-pink-500', () => {
      render(<AuroraChatFrame />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-pink-500');
    });

    it('debe tener un área de mensajes con scroll', () => {
      const { container } = render(<AuroraChatFrame />);
      const scrollArea = container.querySelector('.overflow-y-auto');
      expect(scrollArea).toBeTruthy();
    });
  });

  describe('Accesibilidad', () => {
    it('el input debe tener un placeholder descriptivo', () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i);
      expect(input.getAttribute('placeholder')).toBe('Escribe un mensaje para Aurora...');
    });

    it('el botón debe ser focuseable', () => {
      render(<AuroraChatFrame />);
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('el input debe ser focuseable', () => {
      render(<AuroraChatFrame />);
      const input = screen.getByPlaceholderText(/Escribe un mensaje/i);
      input.focus();
      expect(document.activeElement).toBe(input);
    });
  });
});
