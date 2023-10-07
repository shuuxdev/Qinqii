using System.Security.Cryptography;

namespace Qinqii.Utilities;

public class PasswordHasher
{
    private const int SaltSize = 16;
    private const int KeySize = 32;
    private const int Iterations = 10000;
    private static readonly HashAlgorithmName HashAlgorithm = HashAlgorithmName.SHA256;
    private const char Delimiter = ';';

    public string Hash(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, HashAlgorithm, KeySize);
        return String.Join(Delimiter, Convert.ToBase64String(salt), Convert.ToBase64String(hash));
    }

    public bool Verify(string passwordHash, string inputPassword)
    {
        var elements = passwordHash.Split(Delimiter);
        var salt = Convert.FromBase64String(elements[0]);
        var hash = Convert.FromBase64String(elements[1]);
        var newHash = Rfc2898DeriveBytes.Pbkdf2(inputPassword, salt, Iterations, HashAlgorithm, KeySize);
        return CryptographicOperations.FixedTimeEquals(hash, newHash);
    }
}