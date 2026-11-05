export interface Article {
  title: string;
  authors: string;
  venue: string;
  year: string;
  citations: string;
  link: string;
  imageUrl: string;
}

export interface PhysicistData {
  name: string;
  title: string;
  summary: string;
  affiliation: string;
  affiliationMapsLink?: string;
  location: string;
  locationMapsLink?: string;
  contactAddress: string;
  groupName: string;
  articles: Article[];
  featuredArticle?: Article;
}

function img(keyword: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(keyword)}/800/600`;
}

const PROFILE: PhysicistData = {
  name: "Hong Qiao",
  title: "Postdoctoral Researcher · Quantum Acoustics & Mechanical Quantum Computing",
  summary: `Hong Qiao is an experimental physicist and postdoctoral researcher at UC Berkeley, where he pioneers the use of **individual quanta of sound — phonons** — as the fundamental building blocks of quantum information processing. His work sits at the intersection of quantum acoustics, superconducting circuits, and mechanical resonators, opening a new pathway toward scalable quantum computers built from sound rather than light or charge.

During his PhD at the University of Chicago (2024), Hong Qiao demonstrated landmark results including the first **lossless phonon beam splitter**, deterministic multi-phonon entanglement across separate substrates, and phonon phase gates with number-resolving detection — collectively establishing a viable platform for **linear mechanical quantum computing**, analogous to linear optical quantum computing but with acoustic modes.

His research has been published in *Nature*, *Nature Physics*, and *Nature Communications*, and has laid the theoretical and experimental groundwork for a new class of hybrid quantum devices that harness the long coherence times and strong nonlinearities of mechanical resonators coupled to superconducting qubits.`,
  affiliation: "UC Berkeley",
  affiliationMapsLink: "https://www.google.com/maps/search/?api=1&query=UC+Berkeley",
  location: "Berkeley, CA",
  locationMapsLink: "https://www.google.com/maps/search/?api=1&query=Berkeley+CA",
  contactAddress: "UC Berkeley, Berkeley, CA 94720",
  groupName: "Quantum Acoustics Lab",
  featuredArticle: {
    title: "Splitting phonons without loss",
    authors: "Hong Qiao, Uwe von Lüpke, Aleksey Fedorov, Yu-Xin Wang, Chitres Guria, Felix Motzoi, Konrad Lehnert",
    venue: "Nature",
    year: "2023",
    citations: "~45",
    link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=yf8M9z4AAAAJ&citation_for_view=yf8M9z4AAAAJ:W7OEmFMy1HYC",
    imageUrl: img("beam splitter phonon quantum optics"),
  },
  articles: [
    {
      title: "Acoustic phonon phase gates with number-resolving phonon detection",
      authors: "Hong Qiao et al.",
      venue: "Nature Physics",
      year: "2025",
      citations: "~5",
      link: "https://www.nature.com/articles/s41567-025-03027-z",
      imageUrl: img("phonon phase gate quantum circuit"),
    },
    {
      title: "Deterministic multi-phonon entanglement between two mechanical resonators on separate substrates",
      authors: "Hong Qiao et al.",
      venue: "Nature Communications",
      year: "2025",
      citations: "~3",
      link: "https://www.nature.com/articles/s41467-025-56454-0",
      imageUrl: img("entangled mechanical resonators"),
    },
    {
      title: "Developing a platform for linear mechanical quantum computing",
      authors: "Hong Qiao et al.",
      venue: "arXiv",
      year: "2023",
      citations: "~20",
      link: "https://arxiv.org/abs/2302.07791",
      imageUrl: img("linear optical quantum computing phonon"),
    },
    {
      title: "A New Platform for Hybrid Quantum Computing with Individual Quanta of Sound",
      authors: "Hong Qiao",
      venue: "PhD Dissertation, University of Chicago",
      year: "2024",
      citations: "~2",
      link: "https://knowledge.uchicago.edu/record/13961",
      imageUrl: img("quantum computing sound phonon chip"),
    },
    {
      title: "Hong-Ou-Mandel interference with itinerant surface acoustic phonons",
      authors: "Hong Qiao et al.",
      venue: "APS March Meeting",
      year: "2023",
      citations: "~8",
      link: "https://scholar.google.com/citations?user=yf8M9z4AAAAJ",
      imageUrl: img("Hong-Ou-Mandel interference acoustic"),
    },
  ],
};

export async function fetchPhysicistData(_url: string): Promise<PhysicistData> {
  return PROFILE;
}
