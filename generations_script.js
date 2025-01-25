// Array of images and texts
const images = [
    {
      src: 'image_example_5.png',
      text: 'A quiet forest path, dappled sunlight filtering through the trees, soft moss covering the ground, a few fallen leaves scattered around, a gentle breeze rustling the branches above, the air fresh and cool, the atmosphere calm and serene.'
    },
    {
      src: 'image_example_1.png',
      text: 'Confident woman, standing with hands on her hips, big bright pink lips, wearing knee-high black boots, long black pants, a wrinkled black shirt, long wavy dark hair cascading down her back, intense gaze, standing in front of a graffiti-covered wall, dim urban setting, faint neon lights reflecting off wet pavement, a bold and edgy vibe, exuding strength and charisma.'
    },
    {
      src: 'image_example_2.png',
      text: 'Blonde woman, beautiful, attractive, smiling, blue eyes, bright pink lips, oily face, thick neck, blonde hair, sitting on a sofa, long blue t shirt, blue jeans, legs crossed, big gold necklace on neck, massive gold earrings on ears, a lot of gold bangles on wrists, tarnished and torn sofa, dimly lit background.'
    },
    {
      src: 'image_example_6.png',
      text: 'A small, rustic wooden cabin by a calm lake, surrounded by tall grass and a few scattered rocks, the sky clear with soft blue hues, a gentle breeze rippling the water, the cabin’s smoke rising in thin wisps from the chimney, the atmosphere peaceful and quiet.'
    },
    {
      src: 'image_example_3.png',
      text: 'Ancient Egyptian woman, tall, strikingly beautiful, dark almond-shaped eyes lined with kohl, smooth bronze skin, straight black hair cut to shoulder length with blunt bangs, wearing a white linen dress tied with a gold sash, a broad gold and turquoise necklace on her neck, gold cuffs on her wrists, a jeweled serpent headband on her forehead, standing confidently, hieroglyphs carved into sandstone walls behind her, dim torchlight casting warm shadows, sand scattered across the stone floor, a regal and mysterious aura.'
    },
    {
      src: 'image_example_4.png',
      text: 'Indian woman, standing tall with a confident posture, big bright pink lips, wearing knee-high black boots, long black pants, a wrinkled black shirt, her long dark hair flowing freely, striking kohl-lined eyes, standing in front of an ancient stone temple, intricate carvings on the walls, warm golden sunlight casting shadows, delicate silver bangles on her wrists, an air of mystery and elegance, blending modern style with timeless culture.'
    }
  ];
  
  let currentIndex = 0; // Track the current image index
  
  // Function to flip the image container
  function flipImage() {
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.classList.toggle('flipped');
  }
  
  // Function to change the image and its text
  function nextImage() {
    // Increment the current index and reset to 0 if we reach the end of the array
    currentIndex = (currentIndex + 1) % images.length;
  
    // Get the image and text elements
    const image = document.getElementById('image');
    const text = document.getElementById('imageText');
  
    // Update the image and text based on the current index
    image.src = images[currentIndex].src;
    text.innerHTML = images[currentIndex].text;
  }
  