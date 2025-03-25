import './Hero.css'; // or other imports

function Hero() {
  return (
    <section className="hero">
      <h1>Freaky Fashion</h1>
      <p>
      Welcome to Freaky Fashion, where style meets bold creativity. Embrace the unconventional and stand out with our unique collections that redefine fashion. Get ready to make a statement!
      </p>
      <div className="hero-image">
        <img src="src/components/images/dressy_image.png" alt="Hero" />
      </div>
    </section>
  );
}

export default Hero;
