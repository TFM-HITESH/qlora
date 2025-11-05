
// Assuming a WebAssembly module is loaded with memory management functions
declare const Module: {
  _malloc(size: number): number;
  _free(ptr: number): void;
  HEAPU8: Uint8Array;
};

/**
 * Allocates a block of memory using the WebAssembly module.
 * @param sizeInBytes - The size of the memory block to allocate in bytes.
 * @returns A promise that resolves with a pointer to the allocated memory.
 */
export const allocateMemory = async (sizeInBytes: number): Promise<number> => {
  try {
    const ptr = Module._malloc(sizeInBytes);
    if (ptr === 0) {
      throw new Error('Memory allocation failed');
    }
    console.log(`Successfully allocated ${sizeInBytes} bytes of memory at address ${ptr}.`);
    return ptr;
  } catch (error) {
    console.error('Error allocating memory:', error);
    throw new Error(`Failed to allocate ${sizeInBytes} bytes of memory`);
  }
};

/**
 * Frees a block of memory using the WebAssembly module.
 * @param ptr - The pointer to the memory block to free.
 * @returns A promise that resolves when the memory has been freed.
 */
export const freeMemory = async (ptr: number): Promise<void> => {
  try {
    Module._free(ptr);
    console.log(`Successfully freed memory at address ${ptr}.`);
  } catch (error) {
    console.error(`Error freeing memory at address ${ptr}:`, error);
    throw new Error(`Failed to free memory at address ${ptr}`);
  }
};
