export default function (id1: string, id2: string) {
  return id1 < id2 ? id1 + id2 : id2 + id1;
}

// showcase:

// id1: abc12
// id2: zxc89
// output: abc12zxc89

// id1: nnn00
// id2: nnn01
// output: nnn00nnn01
